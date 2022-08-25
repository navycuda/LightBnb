/*
\i 1_queries/05_all_my_reservations.sql
*/
SELECT
  reservations.id,
  properties.title,
  reservations.start_date,
  properties.cost_per_night,
  avg(property_reviews.rating)
FROM
  reservations
JOIN
  properties 
  ON reservations.property_id = properties.id
JOIN
  property_reviews
  ON properties.id = property_reviews.property_id
JOIN
  users
  ON reservations.guest_id = users.id
WHERE
  users.id = 1017016
GROUP BY
  reservations.id,
  properties.title,
  properties.cost_per_night
;