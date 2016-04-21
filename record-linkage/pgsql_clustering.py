# -*- coding: utf-8 -*-
"""
Created on Fri Apr 11 15:04:10 2014

Reference to dedupe library used
Gregg, Forest, and Derek Eder. 2014. Dedupe. https://github.com/datamade/dedupe.

Current version only testing out with first 1000 samples
"""

import dedupe
import os
import re
import collections
import time
import csv
import tempfile
import logging
import optparse

import psycopg2 as psy
import psycopg2.extras
from unidecode import unidecode
import dj_database_url

settings_file = 'model_trained.tmp'
training_file = 'training_label.json'

start_time = time.time()

db_conf = dj_database_url.config()

if not db_conf:
    raise Exception(
        'set DATABASE_URL environment variable with your connection, e.g. '
        'export DATABASE_URL=postgres://user:password@host/mydatabase'
    )

con = psy.connect(database=db_conf['NAME'],
                        user=db_conf['USER'],
                        password=db_conf['PASSWORD'],
                        host=db_conf['HOST'],
                        port=db_conf['PORT'],
                        cursor_factory=psycopg2.extras.RealDictCursor)

con2 = psy.connect(database=db_conf['NAME'],
                        user=db_conf['USER'],
                        password=db_conf['PASSWORD'],
                        host=db_conf['HOST'],
                        port=db_conf['PORT'])

c = con.cursor()

TABLE = 'total_merged'
DATA_SELECT = 'SELECT merged_id, artist_name, album_name, track_name, track_duration FROM %s' % TABLE

print 'importing data ...'

#Setting of the data set of types etc
if os.path.exists(settings_file):
    print 'reading from', settings_file
    with open(settings_file) as sf :
        deduper = dedupe.StaticDedupe(sf)
else:
    print 'Use training.py first to get model_trained'

##Pre process for each column with key
def preProcess(column, key):
    if isinstance(column, str):
        column = unidecode(column)
        column = re.sub('  +', ' ', column)
        column = re.sub('\n', ' ', column)
        column = column.strip().strip('"').strip("'").lower().strip()
    if not column :
        column = None
    if (key == 'track_duration'):
        if (column == '0' or column == None):
            column = None
        elif (isinstance(column, str)):
            column = int(column)
        #track duration has to be positive or just invalid
    return column

def preRow(row):
    for (field, column) in row.items():
        row[field] = preProcess(column, field)
    return row

print 'blocking...'
## Create blocking temporary table for mapping

#call this function to regenerate blocks
def generateBlocks():
    print 'generate blocking map'
    # If dedupe learned a Index Predicate, we have to take a pass
    # through the data and create indices.    
    for field in deduper.blocker.index_fields:
        print field
        c2 = con.cursor('c2')
        c2.execute("SELECT DISTINCT %s FROM %s" % (field, TABLE))
        field_data = (preRow(row)[field] for row in c2)
        deduper.blocker.index(field_data, field)
        c2.close()
    # Now we are ready to write our blocking map table by creating a
    # generator that yields unique `(block_key, merged_id)` tuples.
    print 'writing blocking map'

    c3 = con.cursor('c3')
    c3.execute(DATA_SELECT)
    full_data = ((row['merged_id'], preRow(row)) for row in c3)
    b_data = deduper.blocker(full_data)
    with open('blocks_', 'w') as csv_file:
        #csv_file = tempfile.NamedTemporaryFile(prefix='blocks_', delete=False)
        csv_writer = csv.writer(csv_file)
        csv_writer.writerows(b_data)
        c3.close()

    #Todo, add b_data into blocking_map
    # threshold = deduper.threshold(data_d, recall_weight=2)
    # clustered_dupes = deduper.match(data_d, threshold)
    # print '# duplicate sets', len(clustered_dupes)

#call this to update blocks in server
def upload_blocks():
    c.execute("DROP TABLE IF EXISTS blocking_map")
    c.execute("CREATE TABLE blocking_map "
              "(block_key VARCHAR(200), merged_id BIGINT);")
    c.execute("CREATE INDEX blocking_map_key_idx ON blocking_map (block_key);")
    con.commit();

    with open('blocks_', 'r') as f:
        #csv_file.close()
        print 'transfering blocking map'
        c.copy_expert("COPY blocking_map FROM STDIN CSV;", f)
        f.close()
        con.commit()

    print 'prepare blocking table. this will probably take a while ...'
    logging.info("indexing block_key")

    c.execute("DROP TABLE IF EXISTS plural_key")
    c.execute("DROP TABLE IF EXISTS plural_block")
    c.execute("DROP TABLE IF EXISTS covered_blocks")
    c.execute("DROP TABLE IF EXISTS smaller_coverage")

    # Many block_keys will only form blocks that contain a single
    # record. Since there are no comparisons possible withing such a
    # singleton block we can ignore them.
    logging.info("calculating plural_key")
    c.execute("CREATE TABLE plural_key "
              "(block_key VARCHAR(200), "
              " block_id SERIAL PRIMARY KEY)")

    c.execute("INSERT INTO plural_key (block_key) "
              "SELECT block_key FROM blocking_map "
              "GROUP BY block_key HAVING COUNT(*) > 1")

    logging.info("creating block_key index")
    c.execute("CREATE UNIQUE INDEX block_key_idx ON plural_key (block_key)")

    logging.info("calculating plural_block")
    c.execute("CREATE TABLE plural_block "
              "AS (SELECT block_id, merged_id "
              " FROM blocking_map INNER JOIN plural_key "
              " USING (block_key))")

    logging.info("adding index and sorting index")
    c.execute("CREATE INDEX plural_block_merged_id_idx ON plural_block (merged_id)")
    c.execute("CREATE UNIQUE INDEX plural_block_block_id_merged_id_uniq "
              " ON plural_block (block_id, merged_id)")


    # To use Kolb, et.al's Redundant Free Comparison scheme, we need to
    # keep track of all the block_ids that are associated with a
    # particular donor records. We'll use PostgreSQL's string_agg function to
    # do this. This function will truncate very long lists of associated
    # ids, so we'll also increase the maximum string length to try to
    # avoid this.
    # c.execute("SET group_concat_max_len = 2048")

    logging.info("creating covered_blocks")
    c.execute("CREATE TABLE covered_blocks "
              "AS (SELECT merged_id, "
              " string_agg(CAST(block_id AS TEXT), ',' ORDER BY block_id) "
              "   AS sorted_ids "
              " FROM plural_block "
              " GROUP BY merged_id)")

    c.execute("CREATE UNIQUE INDEX covered_blocks_merged_id_idx "
              "ON covered_blocks (merged_id)")
    con.commit()
    # In particular, for every block of records, we need to keep
    # track of a donor records's associated block_ids that are SMALLER than
    # the current block's id. Because we ordered the ids when we did the
    # GROUP_CONCAT we can achieve this by using some string hacks.
    logging.info("creating smaller_coverage")
    c.execute("CREATE TABLE smaller_coverage "
              "AS (SELECT merged_id, block_id, "
              " TRIM(',' FROM split_part(sorted_ids, CAST(block_id AS TEXT), 1)) "
              "      AS smaller_ids "
              " FROM plural_block INNER JOIN covered_blocks "
              " USING (merged_id))")
    con.commit()

#This methods retrieve list of records and yields blocks
def candidates_gen(result_set):
    lset = set
    block_id = None
    records = []
    i = 0
    for row in result_set:
        row = preRow(row)
        if row['block_id'] != block_id:
            if records:
                yield records

            block_id = row['block_id']
            records = []
            i += 1
            if i % 10000 == 0:
                print i, "blocks"
                print time.time() - start_time, "seconds"

        smaller_ids = row['smaller_ids']
        if smaller_ids:
            smaller_ids = lset(smaller_ids.split(','))
        else:
            smaller_ids = lset([])
        records.append((row['merged_id'], row, smaller_ids))
    if records:
        yield records

c4 = con.cursor('c4')
c4.execute("SELECT t.*, "
           "block_id, smaller_ids "
           "FROM smaller_coverage "
           "INNER JOIN %s as t "
           "USING (merged_id) "
           "ORDER BY (block_id)" % (TABLE))

print 'clustering...'
clustered_dupes = deduper.matchBlocks(candidates_gen(c4),
                                      threshold=0.5)

## Writing out results

# We now have a sequence of tuples of donor ids that dedupe believes
# all refer to the same entity. We write this out onto an entity map
# table
c.execute("DROP TABLE IF EXISTS entity_map")

print 'creating entity_map database'
c.execute("CREATE TABLE entity_map "
          "(merged_id INTEGER, canon_id INTEGER, "
          " cluster_score FLOAT, PRIMARY KEY(merged_id))")

csv_file = tempfile.NamedTemporaryFile(prefix='entity_map_', delete=False)
csv_writer = csv.writer(csv_file)

for cluster, scores in clustered_dupes:
    cluster_id = cluster[0]
    for merged_id, score in zip(cluster, scores) :
        csv_writer.writerow([merged_id, cluster_id, score])

c4.close()
csv_file.close()

f = open(csv_file.name, 'r')
c.copy_expert("COPY entity_map FROM STDIN CSV", f)
f.close()

os.remove(csv_file.name)

con.commit()

c.execute("CREATE INDEX head_index ON entity_map (canon_id)")
con.commit()

# Print out the number of duplicates found
print '# duplicate sets'
print len(clustered_dupes)