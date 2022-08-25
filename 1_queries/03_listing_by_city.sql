/*
\i 1_queries/03_listing_by_city.sql
SELECT
  properties.id AS id,
  properties.title AS title,
  properties.cost_per_night AS cost_per_night,
  avg(property_reviews.rating) AS average_rating
FROM
  properties
JOIN
  property_reviews
  ON properties.id = property_reviews.property_id
GROUP BY
  properties.id
ORDER BY
  properties.id
;
*/

SELECT
  properties.id,
  title,
  cost_per_night,
  avg(property_reviews.rating) AS average_rating
FROM
  properties
LEFT JOIN 
  property_reviews
  ON properties.id = property_id
WHERE
  city LIKE '%ancouv%'
GROUP BY
  properties.id
HAVING
  avg(property_reviews.rating) >= 4
ORDER BY
  cost_per_night
LIMIT
  10
;