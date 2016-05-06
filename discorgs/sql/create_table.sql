-- create tables for discogs

CREATE TABLE IF NOT EXISTS  discogs_release (  
	rid varchar(20), 
	styles text,       
	videos text,   
	series text,   
	labels text,           
	community text,      
	year int,      
	images text,             
	format_quantity text, 
	genres text,
	thumb text,   
	extraartists text,         
	title text,
	artists text, 
	-- it's possible that several aritists work on one album
	data_changed varchar(255), 
	master_id varchar(20), 
	-- this release could be a version of a master release
	tracklist text,
	status text, 
	released_formatted text, 
	estimated_weight text,
	released text,
	date_added varchar(64),
	date_changed varchar(64),
	country text,
	notes text,
	identifiers text,
	companies text,
	uri varchar(512),
	formats text,
	resource_url varchar(512),
	master_url varchar(512),
	data_quality text
);

CREATE TABLE IF NOT EXISTS discogs_artist (
	rid varchar(20) PRIMARY KEY,
	profile text,
	urls text,
	releases_url varchar(512),
	resource_url varchar(512),
	name varchar(255),
	uri varchar(512),
	images text,
	data_quality varchar(255),
	realname varchar(255),
	groups text,
	aliases text,
	namevariations text,
	members text
);

CREATE TABLE IF NOT EXISTS discogs_track (
	tid SERIAL PRIMARY KEY,
	-- the primary key is auto_increased
	duration varchar(20),
	position varchar(3),
	type_ varchar(100),
	titile varchar(255),
	release_id varchar(20)
	-- indicates rid in discogs_release
);

