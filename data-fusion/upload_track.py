# -*- coding: utf-8 -*-
"""
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
def upload2(arg):
	f = open(arg, 'r')
	c.copy_expert("COPY {0}.track_fusioned FROM STDIN CSV".format(SCHEMA), f)
	f.close()
	con.commit()

for ag in sys.argv[1:]:
	try:
	  upload2(ag)
	except Exception as e:
	  exc_type, exc_obj, exc_tb = sys.exc_info()
	  fname = os.path.split(exc_tb.tb_frame.f_code.co_filename)[1]
	  print >> sys.stderr, exc_type, fname, exc_tb.tb_lineno, e.strerror