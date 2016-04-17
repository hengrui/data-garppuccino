-- create_table.sql
-- Here puts the table field

CREATE TABLE IF NOT EXISTS spotify_artist(
	-- artist_id for original id in last fm
	id varchar(128),
	name varchar(512), 
	popularity int,
	raw text, 
	update_on timestamp DEFAULT NOW(),
	PRIMARY KEY(name)
);

CREATE TABLE IF NOT EXISTS spotify_album(
	-- artist_id for original id in last fm
	id varchar(128),
	name varchar(512), 
	artist_id varchar(128),
	raw text, 
	update_on timestamp DEFAULT NOW(),
	PRIMARY KEY(id, artist_id)
);

CREATE TABLE IF NOT EXISTS spotify_track(
	-- artist_id for original id in last fm
	id varchar(128),
	name varchar(512), 
	album_id varchar(128),
	duration INTEGER,
	disc_number INTEGER,
	track_number INTEGER,
	raw text, 
	update_on timestamp DEFAULT NOW(),
	PRIMARY KEY(id)
);

CREATE TABLE IF NOT EXISTS echonest_artist(
	id varchar(128),
	raw text,
	PRIMARY KEY(id)
)

CREATE TABLE IF NOT EXISTS echonest_song(
	id varchar(128),
	raw text,
	PRIMARY KEY(id)
)