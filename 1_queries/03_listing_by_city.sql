/*
\i 1_queries/03_listing_by_city.sql
*/
SELECT
  properties.id,
  properties.title,
  properties.cost_per_night,
  properties.average_rating
FROM
  properties
JOIN
  property_reviews
  ON properties.id = property_reviews.property_id
;