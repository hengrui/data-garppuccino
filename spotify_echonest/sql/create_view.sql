CREATE VIEW spotify_merged AS
SELECT
--attributes from track
tr.id AS track_id,
tr.name AS track_name,
tr.raw::json->>'disc_number' AS track_disc_no,
tr.raw::json->>'track_number' AS track_track_no,
tr.raw::json->>'duration_ms' AS track_duration,
tr.raw::json->>'uri' AS track_spotify_id,

--attributes from album
al.name AS album_name,
al.id AS album_id,
al.raw::json->>'type' AS album_type,
al.raw::json->>'uri' AS album_spotify_id,

--attributes from artist
ar.name AS artist_name,
ar.id AS artist_id,
ar.raw::json->>'genres' AS artist_genre,
ar.popularity AS artist_popularity,
ar.raw::json->>'uri' AS artist_spotify_id

FROM spotify_artist ar, spotify_album al, spotify_track tr
WHERE ar.id = al.artist_id AND al.id = tr.album_id
--temporaily remove the problematic cases
AND tr.raw NOT LIKE '{//%';