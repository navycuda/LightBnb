/*
\i 1_queries/04_most_visited_cities.sql
*/
SELECT
  properties.city,
  count(reservations) AS total_reservations
FROM
  properties
JOIN
  reservations
  ON properties.id = reservations.property_id
GROUP BY
  properties.city
ORDER BY
  total_reservations
  DESC
;