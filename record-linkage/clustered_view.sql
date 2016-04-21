CREATE VIEW clustered_view
AS
SELECT m.cluster_score, m.canon_id, record.*
FROM entity_map m INNER JOIN total_merged record USING (merged_id);