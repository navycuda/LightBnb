/*
\i migrations/01_schema.sql
*/

-- drop tables if rerun
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS reservations CASCADE;
DROP TABLE IF EXISTS properties CASCADE;
DROP TABLE IF EXISTS property_reviews CASCADE;

-- Create the tables
CREATE TABLE
  users (
    id INTEGER PRIMARY KEY NOT NULL,
    name VARCHAR(255),
    email VARCHAR(255),
    password VARCHAR(255)
  );
CREATE TABLE
  reservations (
    id INTEGER PRIMARY KEY NOT NULL,
    start_date DATE,
    end_date DATE,
    property_id INTEGER REFERENCES 
      properties(id) ON DELETE CASCADE,
    guest_id INTEGER REFERENCES
      users(id) ON DELETE CASCADE,
  );
