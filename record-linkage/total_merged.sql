-- Here creates the view for the final merged table
-- Use union to add more tables or else
DROP MATERIALIZED VIEW total_merged;
DROP VIEW clustered_view;

CREATE MATERIALIZED VIEW total_merged
AS
SELECT row_number() OVER() as merged_id, * from 
(
SELECT
-- Can use * as well, but see for later
'lastfm'::varchar(128) as source,
row_to_json(row(artist_name, album_name, track_name)) as source_id, --Source id is for reference back to original information
LOWER(artist_name) as artist_name,
LOWER(album_name) as album_name,
LOWER(track_name) as track_name,
LOWER(track_duration) as track_duration,
(artist_tags),
(track_tags)
from lastfm_merged
) as lastfm
WITH DATA
;

CREATE INDEX total_id ON total_merged (merged_id);

-- Union etc etc