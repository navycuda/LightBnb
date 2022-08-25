/*
\i 1_queries/05_all_my_reservations.sql
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
*/

SELECT
  reservations.id,
  properties.title,
  properties.cost_per_night,
  reservations.start_date,
  avg(rating) AS average_rating
FROM
  reservations
JOIN
  properties
  ON reservations.property_id = properties.id
JOIN
  property_reviews
  ON properties.id = property_reviews.property_id
WHERE
  reservations.guest_id = 1
GROUP BY
  properties.id,
  reservations.id
ORDER BY
  reservations.start_date
LIMIT
  10
;