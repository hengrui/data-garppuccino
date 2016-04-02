#!/bin/sh

(cat drop_table.sql create_table.sql) | PGPASSWORD=bigdatahkust psql -d bigdata -U user -h 164.132.194.29;
