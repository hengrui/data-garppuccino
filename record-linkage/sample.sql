-- total sample

DROP VIEW dedupe.total_sample;

CREATE VIEW dedupe.total_sample
AS
SELECT * from 
(
(select * from dedupe.total_merged where source = 'lastfm' limit 2000) UNION ALL
(select * from dedupe.total_merged where source = 'discogs' limit 2000) UNION ALL
(select * from dedupe.total_merged where source = 'spotify' limit 2000)
) as merged order by track_name ASC
;