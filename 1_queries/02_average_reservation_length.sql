/*
\i 1_queries/02_average_reservation_length.sql
*/
SELECT 
  avg(end_date - start_date)
FROM
  reservations
;