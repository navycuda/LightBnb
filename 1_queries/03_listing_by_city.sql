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

