/*
\i 1_queries/01_user_login.sql
*/
SELECT 
  id, name, email, password
FROM
  users
WHERE
  users.email = 'tristanjacobs@gmail.com'
;