const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgres://xxagkkbk:z99W-Mb4qRKyv7eMKFs0mMBirrBUqWsV@kashin.db.elephantsql.com/xxagkkbk',
});

module.exports = {
  query: (text, params, cb) => {
    console.log('executed query: ', text, params);
    return pool.query(text, params, cb);
  },
};
