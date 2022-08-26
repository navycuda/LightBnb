const properties = require('./json/properties.json');
const users = require('./json/users.json');
const { Pool } = require('pg');

const pool = new Pool({
  user: 'navycuda',
  password: '123',
  host: 'localhost',
  database: 'lightbnb'
});

/// Users

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithEmail = function(email) {
  return pool
    .query(`
      SELECT
        *
      FROM
        users
      WHERE
        $1 = users.email
      ORDER BY
        users.id
      LIMIT
        1
      ;
    `,
    [ email ]
    )
    .then((result) => {
      const rows = result.rows;
      return rows.length > 0 ? rows[0] : null;
    })
    .catch((error) => {
      console.log('getUserWithEmail() null', error.message);
    });
};
exports.getUserWithEmail = getUserWithEmail;

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithId = function(id) {
  return pool
    .query(`
      SELECT
        *
      FROM
        users
      WHERE
        $1 = users.id
      ;
    `,
    [ Number(id) ]
    )
    .then((result) => {
      const rows = result.rows;
      return rows.length > 0 ? rows[0] : null;
    })
    .catch((error) => {
      console.log('getUserWithEmail() null', error.message);
    });
};
exports.getUserWithId = getUserWithId;


/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
const addUser =  function(user) {
  const query = `
    INSERT INTO
      users (
        name,
        email,
        password
      )
    VALUES(
      $1,
      $2,
      $3
      )
    RETURNING
      id
  ;
  `;
  const vars = [ user.name, user.email, user.password ];

  return pool
    .query(query, vars)
    .then((user) => {
      console.log(user.rows);
    })
    .catch((error) => {
      console.log('error', error.message);
    });
};
exports.addUser = addUser;

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = function(guest_id, limit = 10) {
  const query = `
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
    reservations.guest_id = $1
  GROUP BY
    properties.id,
    reservations.id
  ORDER BY
    reservations.start_date
  LIMIT
    $2
  ;
  `;
  const vars = [
    Number(guest_id),
    limit
  ];

  return pool
    .query(query, vars)
    .then((reservations) => {
      return reservations.rows;
    })
    .catch((error) => {
      console.log('error', error.message);
    });
};
exports.getAllReservations = getAllReservations;

/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */
const getAllProperties = function(options, limit = 10) {
  const vars = [];
  // Setup base query
  let query = `
    SELECT
      properties.*,
      avg(property_reviews.rating) AS average_rating
    FROM
      properties
    JOIN
      property_reviews ON properties.id = property_id
  `;
  let hasWhere = false;
  const addWHERE = () => {
    if (!hasWhere) {
      hasWhere = true;
      return 'WHERE';
    }
    return 'AND';
  };

  // Filter by city
  if (options.city) {
    vars.push(`%${options.city}%`);
    query += `
      ${addWHERE()}
        properties.city
        LIKE $${vars.length}
    `;
  }
  if (options.owner_id) {
    vars.push(options.owner_id);
    query += `
      ${addWHERE()}
        owner_id = $${vars.length}
    `;
  }
  // Set minimum price
  if (options.minimum_price_per_night) {
    vars.push(options.minimum_price_per_night);
    query += `
      ${addWHERE()}
        properties.cost_per_night > $${vars.length}
    `;
  }
  // Set maximum price
  if (options.maximum_price_per_night) {
    vars.push(options.maximum_price_per_night);
    query += `
      ${addWHERE()}
        properties.cost_per_night < $${vars.length}
    `;
  }
  // Set minimum rating
  if (options.minimum_rating) {
    vars.push(options.minimum_rating);
    query += `
      ${addWHERE()}
        $${vars.length} < (
          SELECT
            avg(rating)
          FROM
            property_reviews
          WHERE
            property_reviews.property_id = properties.id
        )
    `;
  }
  // Last variable to be attached
  vars.push(limit);
  query += `
    GROUP BY
      properties.id
    ORDER BY
      cost_per_night
    LIMIT
      $${vars.length}
    ;
  `;

  return pool
    .query(query, vars)
    .then((result) => {
      return result.rows;
    })
    .catch((error) => {
      console.error(`getAllProperties() error: `, error.message);
    });
};
exports.getAllProperties = getAllProperties;


/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function(p) {


  const vars = [
    p.owner_id,
    p.title,
    p.description,
    p.thumbnail_photo_url,
    p.cover_photo_url,
    p.parking_spaces,
    p.number_of_bathrooms,
    p.number_of_bedrooms,
    p.country,
    p.street,
    p.city,
    p.province,
    p.post_code,
  ];
  const query = `
    INSERT INTO
      properties (
        owner_id,
        title,
        description,
        thumbnail_photo_url,
        cover_photo_url,
        parking_spaces,
        number_of_bathrooms,
        number_of_bedrooms,
        country,
        street,
        city,
        province,
        post_code
      )
    VALUES (
      $1,
      $2,
      $3,
      $4,
      $5,
      $6,
      $7,
      $8,
      $9,
      $10,
      $11,
      $12,
      $13
    )
    RETURNING
      *
    ;
  `;
  return pool
    .query(query, vars)
    .then((result) => {
      return result.rows[0];
    })
    .catch((error) => {
      console.error(`getAllProperties() error: `, error.message);
    });
};
exports.addProperty = addProperty;
