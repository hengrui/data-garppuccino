-- merged table for lastfm
CREATE TYPE tag_row AS(
	name text
);

DROP VIEW lastfm_merged;

CREATE VIEW lastfm_merged
-- column name
AS
-- artist -> at
-- album -> al
-- track -> tr
SELECT 
	api.artist AS artist_name,
	api.album AS album_name,
	api.track AS track_name,
	at.tags as artist_tags,
	track.tags as track_tags,
	track.raw::json->>'duration' as track_duration,
	artist.raw::json->'bio'->>'summary' as artist_biography
from lastfm_album_tracks as api
LEFT JOIN (
	select tr.name, tr.artist_name, json_agg(tr_tags.name) as tags
	from lastfm_track as tr, json_populate_recordset(null::tag_row, tr.raw::json->'tags') tr_tags
	group by tr.name, tr.artist_name
) AS track2(name, artist_name, tags) ON api.track = track2.name AND api.artist = track2.artist_name
LEFT JOIN lastfm_track as track ON api.track = track.name AND api.artist = track.artist_name
LEFT JOIN lastfm_album as al ON api.album = al.name AND api.artist = al.artist_name
LEFT JOIN (
	select json_agg(ar_tags.name) as tags, ar.name from lastfm_artist as ar
	, json_populate_recordset(null::tag_row, ar.raw::json->'tags'->'tag') ar_tags group by ar.name)
AS at(tags, name) on api.artist = at.name
LEFT JOIN lastfm_artist artist on api.artist = artist.name;