# -*- coding: utf-8 -*-
"""
Created on Fri Apr 11 15:04:10 2014

Reference to dedupe library used
Gregg, Forest, and Derek Eder. 2014. Dedupe. https://github.com/datamade/dedupe.

Current version only testing out with first 1000 samples
"""

import datetime
import os
import re
import collections
import time
import csv
import tempfile
import logging
import optparse
import copy
import json
import sys
import psycopg2 as psy
import psycopg2.extras
from unidecode import unidecode
import dj_database_url
import re

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

c = con.cursor()

SCHEMA = 'dedupe'
TABLE = '%s.clustered_view' % SCHEMA
#BLOCKING_TABLE = '%s.blocking_map' % SCHEMA
#BLOCK_KEY_TABLE = '%s.block_key' % SCHEMA

DATA_SELECT = 'SELECT * FROM %s order by canon_id' % TABLE

##Pre process for each column with key
def preProcess(column, key):
    if isinstance(column, bytes):
        column = unidecode(column)
    if isinstance(column, str):
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

def candidates_gen(result_set):
    lset = set
    canon_id = None
    records = []
    i = 0
    for row in result_set:
        row = preRow(row)
        if row['canon_id'] != canon_id:
            if records:
                yield records
            block_id = row['canon_id']
            records = []
            i += 1
            if i % 10000 == 0:
                print i, "clusters"
                print time.time() - start_time, "seconds"
        records.append((row['canon_id'], row))
        canon_id = row['canon_id']
    if records:
        yield records

def LCS_tracknames(tracks):
    content_voting = {}
    l = len(tracks)
    threshold = l * 0.3
    for track in tracks:
        for (idx, word) in enumerate(track.split(' ')):
            tmp = content_voting.setdefault(idx, collections.Counter())
            tmp[word] += 1
    #print content_voting
    maxwords = (sorted(((w, c) for (w, c) in tmp.items()), key=lambda t: (t[1], len(t[0])), reverse=True)[0]
    for (idx, tmp) in content_voting.items())
    return " ".join(w[0] for w in maxwords if w[1] >= threshold)

urlregexp = re.compile(r"(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:;%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:;%_\+.,\(\)~#?&//=]*)")
def findlinks(t):
    links = [match.group(0) for match in urlregexp.finditer(t)]
    return links

def findlink(t):
    l = findlinks(t)
    return l[len(l) / 2] if (len(l) > 0) else ''

def getArtist(r, idx, name):
    link = r["artist_urls"]
    try:
        if (r["source"] == 'discogs'):
            link = 'https://www.discogs.com/artist/' + str(json.loads(r["source_id"])["f1"][idx])
    except Exception as e:
        exc_type, exc_obj, exc_tb = sys.exc_info()
        fname = os.path.split(exc_tb.tb_frame.f_code.co_filename)[1]
        print >> sys.stderr, exc_type, fname, exc_tb.tb_lineno
    return (name, link)

def getTags(source, v):
    obj = json.loads(v)
    for t in obj:
        if (isinstance(t, str)):
            yield t
        if ("name" in t):
            yield t["name"]

def fusion(clist):
    song = {}
    rows = [c[1] for c in clist]
    sources = {}
    best = {}
    for row in rows:
        sources[row["source"]] = row
    if ('spotify' in sources):
        song = copy.deepcopy(sources['spotify'])
    elif ('lastfm' in sources):
        song = copy.deepcopy(sources['lastfm'])
    else:
        song = copy.deepcopy(sources['discogs'])

    for (key, v) in song.items():
        if ("tags" in key or "images" in key):
            song[key] = []
    song['artist_name'] = []
    # song['albums'] = []
    song["sources"] = dict((s, row["track_urls"]) for (s, row) in sources.items())
    for row in rows:
        # if (row["album_name"] is not None and row["album_urls"] is not None):
        #     song[albums].append((row["album_name"], row["album_urls"]))
        for (key, value) in row.items():
            if (value is None):
                continue
            if ("tags" in key):
                song[key].extend(getTags(row["source"], value))
            if ("images" in key):
                song[key].append(findlink(value))
            if (key == 'artist_name'):
                song[key].extend(
                    getArtist(row, idx, a.strip()) for (idx, a) in enumerate(value.split(" & ")))
            if (key not in song or song[key] is None):
                song[key] = value

    song["merged_ids"] = [int(row["merged_id"]) for row in rows]
    album_years = [row["album_year"] for row in rows]
    song["track_name"] = LCS_tracknames([row["track_name"] for row in rows])
    song["track_listeners"] = max(row["track_listeners"] for row in rows)
    del song["track_position"]
    del song["merged_id"]
    del song["artist_biography"]
    del song["artist_urls"]
    del song["album_urls"]    
    if ("track_duration" in song and song["track_duration"] is not None):
        song["track_duration"] = str(datetime.timedelta(milliseconds = song["track_duration"]))
    for (key, v) in song.items():
        if (v == None):
            del song[key]
        if (key == "sources"):
            continue
        if (isinstance(v, list)):
            song[key] = list(set(song[key]))
    if (sum(1 for a in album_years if a != None) != 0):
        song["release_year"] = min(a for a in album_years if a != None)
    else:
        song["release_year"] = None
    return (song, song["artist_name"])

c2 = con.cursor('c2')
c2.execute(DATA_SELECT)
g = 0
def colfor(v, k):
    if (isinstance(v, list) or isinstance(v, dict)):
        return json.dumps(v, ensure_ascii=False).encode('utf8')
    return v

def load():
    columns = ("canon_id merged_ids sources track_name track_images album_images artist_images"
        " track_duration track_tags track_listeners release_year").split(" ")
    ar_columns = ("canon_id track_name artist_name artist_urls artist_tags")

    csv_file = open('fusioned_song', 'w')
    csv_file2 = open('artist_track', 'w')

    csv_writer = csv.writer(csv_file)
    csv_writer2 = csv.writer(csv_file2)
    for records in candidates_gen(c2):
        rec, artists = fusion(records)    
        csv_writer.writerow([colfor(rec[k], k) if (k in rec) else None for k in columns])
        for artist in artists:
            csv_writer2.writerow([colfor(v, "") for v in [rec["canon_id"], rec["track_name"], artist[0], artist[1], rec["track_tags"] ]])
        #print >> csv_file, json.dumps(fusion(records))

    csv_file.close()
    csv_file2.close()

def upload():
    f = open('fusioned_song', 'r')
    c.copy_expert("COPY {0}.track_fusioned FROM STDIN CSV".format(SCHEMA), f)
    f.close()

    f = open('artist_track', 'r')
    c.copy_expert("COPY {0}.artist_track FROM STDIN CSV".format(SCHEMA), f)
    f.close()

    con.commit()

print '--- importing data ---'
try:
    load()
    pass
except Exception:
    print >> sys.stderr, "not finished"
    exc_type, exc_obj, exc_tb = sys.exc_info()
    fname = os.path.split(exc_tb.tb_frame.f_code.co_filename)[1]
    print >> sys.stderr, exc_type, fname, exc_tb.tb_lineno
    pass
print '--- uploading data ---'
upload()
print '--- finished ---'
