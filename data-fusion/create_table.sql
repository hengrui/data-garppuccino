CREATE TABLE dedupe2.track_fusioned(
	canon_id integer,
	merged_ids text,
	sources text, --sources in form {spotify: , discogs: , }
	track_name text,
	track_images text,
	album_images text,
	artist_images text,
	track_duration varchar(20),
	track_tags text,
	track_listeners integer,
	release_year integer
);

CREATE TABLE dedupe2.artist_track(
	canon_id integer,	
	track_name text,
	artist_name text,
	artist_urls text,
	artist_tags text
);