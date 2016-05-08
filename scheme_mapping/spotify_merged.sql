DROP VIEW spotify_merged2;

CREATE VIEW spotify_merged2 AS
SELECT
--attributes from track
'spotify'::varchar(10) as source,
row_to_json(row(ar.id, al.id, tr.id))::text as source_id, --Source id is for reference back to original information	

tr.name AS track_name,
tr.raw::json->>'disc_number' AS track_disc_number,
tr.raw::json->>'track_number' AS track_position,

tr.raw::json->>'duration_ms' AS track_duration,
-- tr.raw::json->>'uri' AS track_spotify_id,
tr.raw::json->>'images' as track_images,
CONCAT('https://open.spotify.com/track/', tr.id) as track_urls,
null::text as track_tags,

--attributes from album
al.name AS album_name,
CONCAT('https://open.spotify.com/album/', ar.id) as album_urls,
null::integer as album_year,
al.raw::json->>'images' as album_images,
null::text as album_tags,
-- al.id AS album_id,
-- al.raw::json->>'type' AS album_type,
-- al.raw::json->>'uri' AS album_spotify_id,

--attributes from artist
ar.name AS artist_name,
ar.id AS artist_id,
ar.echonest_raw::json->>'genres' AS artist_tags,
-- ar.popularity AS artist_popularity,
-- ar.raw::json->>'uri' AS artist_spotify_id
CONCAT('https://open.spotify.com/artist/', ar.id) as artist_urls,
ar.raw::json->>'images' AS artist_images,
ar.echonest_raw::json->'biographies' as artist_biography,

null::integer as artist_listeners,
null::integer as track_listeners

FROM spotify_echonest_artist ar, spotify_album al, spotify_track tr
WHERE ar.id = al.artist_id AND al.id = tr.album_id
--temporaily remove the problematic cases
AND tr.raw NOT LIKE '{//%';