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