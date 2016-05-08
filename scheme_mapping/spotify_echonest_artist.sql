DROP VIEW spotify_echonest_artist;

CREATE VIEW spotify_echonest_artist
AS
select 
a.id,
a.name, 
a.raw raw,
e.raw::json->'response'->>'artist' as echonest_raw
from spotify_artist a join echonest_artist e on a.id = e.id
and e.raw::json->'response'->'status'->>'code' = '0';
