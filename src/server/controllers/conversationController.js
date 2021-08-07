const db = require('../models/conversationsModel');

module.exports = {
  getAll: (req, res, next) => {
    res.locals.response = { conversations: [], msg: '', ok: true };
    const queryString = 'SELECT * FROM "public"."conversations"';
    db.query(queryString)
      .then((data) => {
        console.log(data);
        res.locals.conversations = data.rows;
        return next();
      });
  },

  mutate: (req, res, next) => {

  },

  transform: (req, res, next) => {

  },

  delete: (req, res, next) => {

  },
};
