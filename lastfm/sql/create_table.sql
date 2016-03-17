-- create_table.sql
-- Here puts the table field

CREATE TABLE IF NOT EXISTS lastfm_artist(
	-- artist_id for original id in last fm
	id varchar(128),
	name varchar(512), 
	lastname varchar(256),
	firstname varchar(256),
	listeners int,
	playcount int,
	bio text,
	tags text,
	update_on timestamp DEFAULT NOW()
	-- PRIMARY KEY(name)
);

CREATE TABLE IF NOT EXISTS lastfm_album(
	-- album_id for original id in last fm
	id varchar(128), 
	name varchar(512),
	listeners int,
	playcount int,
	tags text,
	artist_id varchar(128),
	artist_name varchar(512),
	-- release date
	-- just put raw for now, unknown data..
	raw text,
	update_on timestamp DEFAULT NOW()
	-- PRIMARY KEY(name, artist_name)
);

CREATE TABLE IF NOT EXISTS lastfm_track(
	-- track_id for original id in last fm
	id varchar(128), 
	name varchar(512),
	listeners int,
	playcount int,
	tags text,
	artist_id varchar(128),
	artist_name varchar(512),
	duration int,
	-- just put raw for now, unknown data..
	raw text,
	update_on timestamp DEFAULT NOW()
	-- PRIMARY KEY(name, artist_name)
);

CREATE TABLE IF NOT EXISTS lastfm_album_tracks(
	album varchar(512),
	artist varchar(512),
	track varchar(512)
	-- PRIMARY KEY(album, artist, track)
)