-- First deal with releases
-- Gather items with same rid together
WITH CTE
AS
(
	SELECT *, ROW_NUMBER() OVER(PARTITION BY rid) AS RN
	FROM discogs_release2
)

SELECT * INTO discogs_temp
FROM CTE
WHERE RN = 1;

ALTER TABLE discogs_temp
DROP COLUMN RN;

INSERT INTO discogs_release
SELECT * FROM discogs_temp;

-- For the artist table, repeate operations above
WITH CTE
AS
(
	SELECT *, ROW_NUMBER() OVER(PARTITION BY aid) AS RN
	FROM discogs_artist2
)

SELECT * INTO discogs_temp
FROM CTE
WHERE RN = 1;

ALTER TABLE discogs_temp
DROP COLUMN RN;

INSERT INTO discogs_artist
SELECT * FROM discogs_temp;




