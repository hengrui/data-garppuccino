-- create_table.sql
-- Here puts the table field

CREATE TABLE IF NOT EXISTS lastfm_artist(
	-- artist_id for original id in last fm
	id varchar(128),
	name varchar(128), 
	lastname varchar(128),
	firstname varchar(128),
	listeners int,
	playcount int,
	bio text,
	tags json,
	PRIMARY KEY(id)
);

CREATE TABLE IF NOT EXISTS lastfm_album(
	-- album_id for original id in last fm
	id varchar(128), 
	listeners int,
	tags json,
	artist_id varchar(128),
	-- just put raw for now, unknown data..
	raw json,
	PRIMARY KEY(id)
);

CREATE TABLE IF NOT EXISTS lastfm_track(
	-- track_id for original id in last fm
	id varchar(128), 
	listeners int,
	tags json,
	artist_id varchar(128),
	-- just put raw for now, unknown data..
	raw json,
	PRIMARY KEY(id)
);