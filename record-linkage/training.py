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
                        port=db_conf['PORT'])

con2 = psy.connect(database=db_conf['NAME'],
                        user=db_conf['USER'],
                        password=db_conf['PASSWORD'],
                        host=db_conf['HOST'],
                        port=db_conf['PORT'])

c = con.cursor(cursor_factory=psy.extras.RealDictCursor)

DATA_SELECT = 'SELECT artist_name, album_name, track_name, track_duration FROM lastfm_merged limit 1000'

print 'importing data ...'
c.execute(DATA_SELECT)
data= c.fetchall()

#pre process every column
def preProcess(column, key):
    column = unidecode(column)
    column = re.sub('  +', ' ', column)
    column = re.sub('\n', ' ', column)
    column = column.strip().strip('"').strip("'").lower().strip()
    if not column :
        column = None
    if (key == 'track_duration'):
        if (column == '0'):
            column = None
        else:
            column = int(column)
        #track duration has to be positive or just invalid
    return column

data_d = {}
for row_id, row in enumerate(data):
    clean_row = [(k, preProcess(v, k)) for (k, v) in row.items()]
    #row_id = int(row['id'])
    #I don't have row id
    data_d[row_id] = dict(clean_row)


#Setting of the data set of types etc
if os.path.exists(settings_file):
    print 'reading from', settings_file
    with open(settings_file) as sf :
        deduper = dedupe.StaticDedupe(sf)
else:
    fields = [
        {'field' : 'album_name', 'type': 'String'},
        {'field' : 'track_name', 'type': 'String'},
        {'field' : 'artist_name', 'type': 'String'},
        {'field' : 'track_duration', 'type': 'Price', 'has missing': True},
        ]

    deduper = dedupe.Dedupe(fields)

    deduper.sample(data_d, 150000)

    if os.path.exists(training_file):
        print 'reading labeled examples from ', training_file
        with open(training_file) as tf :
            deduper.readTraining(tf)

    print 'starting active labeling...'
    dedupe.consoleLabel(deduper)
    deduper.train()
    
    with open(training_file, 'w') as tf :
        deduper.writeTraining(tf)

    with open(settings_file, 'w') as sf :
        deduper.writeSettings(sf)

print 'blocking...'

threshold = deduper.threshold(data_d, recall_weight=2)
clustered_dupes = deduper.match(data_d, threshold)
print '# duplicate sets', len(clustered_dupes)

#result output
full_data = []
for cluster_id, (cluster, score) in enumerate(clustered_dupes):
    for record_id in cluster:
        print cluster_id, ': record id', data_d[record_id]
