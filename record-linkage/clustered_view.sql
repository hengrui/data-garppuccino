CREATE VIEW dedupe2.clustered_view
AS
SELECT
case when m is null then 1 else m.cluster_score end as cluster_score,
case when m.canon_id is null then record.merged_id else m.canon_id end as canon_id,
record.*
FROM dedupe.total_merged record LEFT JOIN dedupe2.entity_map m USING (merged_id);