const db = require('../models/conversationsModel');

module.exports = {
  getAll: (req, res, next) => {
    // Format response object
    res.locals.response = { conversations: [], msg: '', ok: true };

    const queryString = 'SELECT * FROM "public"."conversations"';
    db.query(queryString)
      .then((data) => {
        // Log the data from the query and push it to the correct respone format
        console.log('Result ', data.rows);

        // Edge check for no valid data
        if (data.rows.length !== 0) res.locals.response.conversations.push(...data.rows);
        else console.log('No conversations found in getAll middleware');
      })
      .catch((err) => {
        // Update response to include error messages
        console.log(`error querying database in getAll: ${err}`);

        res.locals.response.msg = 'Error querying database for all conversations';
        res.locals.response.ok = false;
      })
      .finally(() => next());
  },

  verifyConversation: (req, res, next) => {
    const { conversationId: convID } = req.body;

    // Query to verify the conversation id exists - if it doesn't create one
    db.query('SELECT * FROM conversations WHERE id = $1', [convID])
      .then((rawData) => rawData.json())

      .then((dbInfo) => {
        // If the conversation does not exist, intialize one
        if (dbInfo.rows.length === 0) {
          db.query('INSERT INTO conversations (id) VALUES ($1)', [convID])
            .catch((err) => {
              res.locals.response.ok = false;
              res.locals.err = {
                error: err,
                msg: `Could not create new  conversation with id ${convID}`,
                log: 'Error found in query within verifyConversation middleware',
              };
            });
        }
      })

      .catch((err) => {
        res.locals.err = {
          error: err,
          msg: 'Could not verify conversation',
          log: 'Error found in query within verifyConversation middleware',
        };
      })

      .finally(() => next());
  },

  addMutation: async (req, res, next) => {
    const {
      author, conversationId: convID, data: mods, origin,
    } = req.body;

    res.locals.response = { text: '', msg: '', ok: true };

    // Create a new mutation and update the conversation data
    // Query conversation DB to find the last mutation in order to verify the origin
    const dbQuery = `
    SELECT convos.*, mutations.* 
    FROM "public"."conversations" convos 
      LEFT JOIN "public"."mutations" mutations
        ON mutations.conversationID=convos.id
    WHERE convos.id=$1
    ORDER BY mutations.bob_origin DESC, mutations.alice_origin DESC;
    `;

    const dbData = await db.query(dbQuery, [convID]);
  },

  transform: (req, res, next) => {

  },

  delete: (req, res, next) => {
    // initialize response object
    res.locals.response = { msg: '', ok: true };

    // extract conversation to delete via id
    const { conversationId: convID } = req.body;

    // query the DB
    db.query('DELETE FROM public.conversations WHERE id = $1', [convID])
      .catch((err) => {
        res.locals.response.ok = false;
        res.locals.err = {
          error: err,
          msg: `Could not delete conversation with id ${convID}`,
          log: 'Error found in query within delete middleware',
        };
      })
      .finally(() => next());
  },
};
