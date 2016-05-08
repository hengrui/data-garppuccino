CREATE TYPE artist_row AS(
	name text,
	id varchar(20)
);

CREATE TYPE track_row AS(
	duration varchar(10),
	position varchar(10),
	title text
);

DROP VIEW discogs_merged;
DROP VIEW discogs_tracks;
DROP VIEW discogs_album_artists;

CREATE VIEW discogs_tracks
AS
select
d.rid album_id,
t->>'title' title,
(case when (t->>'duration' = '') then null else CONCAT(t->>'duration', '000') end) as duration,
t->>'position' as position
from discogs_release d, json_array_elements(d.tracklist::json) t;

CREATE VIEW discogs_album_artists
AS
select
d.rid album_id,
string_agg(ar.name, ' & ') artist_names,
json_agg(ar.id) artist_ids
from discogs_release d, json_populate_recordset(null::artist_row, d.artists::json) ar
 group by d.rid;

CREATE VIEW discogs_merged
-- column name
AS
-- artist -> at
-- album -> al
-- track -> tr
-- uri as follow https://www.discogs.com/artist/1003636-Adam-Truby
select
'discogs'::varchar(10) as source,
row_to_json(row(da.artist_ids, da.album_id, t.title))::text as source_id,
da.artist_names artist_name,
d.title album_name,
t.title track_name,
t.duration track_duration,
null::text as artist_tags,
d.genres as album_tags,
d.genres as track_tags,
a.uri as artist_urls,
d.uri as album_urls,
d.uri as track_urls,
null::text as track_disc_number,
t.position track_position,
a.images artist_images,
d.images album_images,
null::text as track_images,
null::integer as artist_listeners,
null::integer as track_listeners,
a.profile as artist_biography,
d.year album_year,
da.artist_ids artist_ids,
d.rid album_id
from discogs_tracks t
inner join discogs_release d on t.album_id = d.rid
inner join discogs_album_artists da on d.rid = da.album_id
left join discogs_artist a on da.artist_ids->>0 = a.rid;

