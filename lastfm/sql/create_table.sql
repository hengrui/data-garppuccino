-- create_table.sql
-- Here puts the table field

CREATE TABLE IF NOT EXISTS lastfm_artist(
	-- artist_id for original id in last fm
	id varchar(128),
	name varchar(256), 
	lastname varchar(256),
	firstname varchar(256),
	listeners int,
	playcount int,
	bio json,
	tags json,
	update_on timestamp DEFAULT NOW(),
	PRIMARY KEY(name)
);

CREATE TABLE IF NOT EXISTS lastfm_album(
	-- album_id for original id in last fm
	id varchar(128), 
	name varchar(512),
	listeners int,
	playcount int,
	tags json,
	artist_id varchar(128),
	artist_name varchar(512),
	-- release date
	-- just put raw for now, unknown data..
	raw json,
	update_on timestamp DEFAULT NOW(),
	PRIMARY KEY(name)
);

CREATE TABLE IF NOT EXISTS lastfm_track(
	-- track_id for original id in last fm
	id varchar(128), 
	name varchar(512),
	listeners int,
	playcount int,
	tags json,
	artist_id varchar(128),
	artist_name varchar(512),
	duration int,
	-- just put raw for now, unknown data..
	raw json,
	update_on timestamp DEFAULT NOW(),
	PRIMARY KEY(name)
);