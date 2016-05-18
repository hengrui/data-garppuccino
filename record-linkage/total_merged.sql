-- Here creates the view for the final merged table
-- Use union to add more tables or else
DROP VIEW dedupe.clustered_view;
--DROP table dedupe.total_merged;

CREATE table dedupe.total_merged
AS
SELECT row_number() OVER() as merged_id, * from (
(
	SELECT source, source_id, artist_name, album_name, track_name, track_duration, artist_tags::text, album_tags::text, track_tags::text, artist_urls, album_urls, track_urls, track_disc_number, track_position, artist_images, album_images, track_images, artist_listeners, track_listeners, artist_biography::text, album_year
	from lastfm_merged2
)
UNION ALL
(
	SELECT source, source_id, artist_name, album_name, track_name, track_duration, artist_tags::text, album_tags::text, track_tags::text, artist_urls, album_urls, track_urls, track_disc_number, track_position, artist_images, album_images, track_images, artist_listeners, track_listeners, artist_biography::text, album_year
	from spotify_merged2
)
UNION ALL
(
	SELECT source, source_id, artist_name, album_name, track_name, track_duration, artist_tags::text, album_tags::text, track_tags::text, artist_urls, album_urls, track_urls, track_disc_number, track_position, artist_images, album_images, track_images, artist_listeners, track_listeners, artist_biography::text, album_year
	from discogs_merged
	where track_name != ''
)
) as merged
;

DROP INDEX total_merged_id;
CREATE INDEX total_merged_id ON dedupe.total_merged (merged_id);

-- Union etc etc