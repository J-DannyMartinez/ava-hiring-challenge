const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DB_URI,
});

module.exports = {
  query: (text, params, cb) => {
    console.log('executed query: ', text, params);
    return pool.query(text, params, cb);
  },
};
