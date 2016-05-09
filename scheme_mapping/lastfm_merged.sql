-- merged table for lastfm
CREATE TYPE tag_row AS(
	name text
);

DROP VIEW lastfm_merged2;

CREATE VIEW lastfm_merged2
-- column name
AS
-- artist -> at
-- album -> al
-- track -> tr
SELECT 
	'lastfm'::varchar(10) as source,
	row_to_json(row(api.artist, api.album, api.track))::text as source_id, --Source id is for reference back to original information	
	api.artist AS artist_name,
	api.album AS album_name,
	api.track AS track_name,
	track.raw::json->>'duration' as track_duration,
	
	at.tags as artist_tags,
	album.tags::json->'tag' as album_tags,
	track.tags as track_tags,

	artist.raw::json->>'image' as artist_images,
	album.raw::json->>'image' as album_images,
	track.raw::json->>'image' as track_images,

	null::varchar(10) as track_disc_number,
	null::varchar(10) as track_position,
	
	CAST(artist.raw::json->>'listeners' as INT) as artist_listeners,
	CAST(track.raw::json->>'listeners' as INT) as track_listeners,
	artist.raw::json->'bio'->>'summary' as artist_biography,
	replace('http://www.last.fm/music/' || (artist_name), ' ', '%20') as artist_urls,
	album.raw::json->>'url' as album_urls,
	'http://www.last.fm/music/' || (artist_name) || '_/' || (track_name) as track_urls,
	null::integer as album_year
from lastfm_album_tracks as api
LEFT JOIN (
	select tr.name, tr.artist_name, json_agg(tr_tags.name) as tags
	from lastfm_track as tr, json_populate_recordset(null::tag_row, tr.raw::json->'tags') tr_tags
	group by tr.name, tr.artist_name
) AS track2(name, artist_name, tags) ON api.track = track2.name AND api.artist = track2.artist_name
LEFT JOIN lastfm_track as track ON api.track = track.name AND api.artist = track.artist_name
LEFT JOIN lastfm_album as album ON api.album = album.name AND api.artist = album.artist_name
LEFT JOIN (
	select json_agg(ar_tags.name) as tags, ar.name from lastfm_artist as ar
	, json_populate_recordset(null::tag_row, ar.raw::json->'tags'->'tag') ar_tags group by ar.name)
AS at(tags, name) on api.artist = at.name
LEFT JOIN lastfm_artist artist on api.artist = artist.name;