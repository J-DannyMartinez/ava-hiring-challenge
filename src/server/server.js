const express = require('express');
const cors = require('cors');
const path = require('path');
const convController = require('./controllers/conversationController');

const data = {
  personalInfo: {
    email: 'me@jdanielmartinez.com',
    name: 'Danny Martinez',
  },
  frontendUrl: '',
  sources: {
    front: '',
    back: 'https://github.com/J-DannyMartinez/ava-hiring-challenge',
  },
  answers: {
    1: 'My approach to this problem was to start with creating the backend endpoints, create the mutation algorithm as middleware, and move forward with the React frontend to tie together the entire full-stack application. When creating the endpoints at the start, I focused on creating a skeleton of all needed endpoints and estimated middleware functionality to keep a roadmap of my progress. The /get methods, as usual, were pretty straightforward to implement. When I started my work on posting to conversations, I took a break from the programming to initialize a database to hold the information, which took a good chunk out of Day 2. I have an ER diagram which can be viewed here: https://imgur.com/a/RHdutmN . After my database was set up successfully, I worked on the GET and DELETE endpoints to manipulate the conversation data, then started work on the POST endpoint, which would house the core of the OT algorithm. When I realized I was close to the expiration of the 3-day time limit, I started working on a quick skeleton for the front-end React portion. Thank you for reading!',
    2: 'If I had more time, I would love to fully flesh out the mutation algorithm, complete the front-end portion, and work on the undo functionality, as that seems rather interesting to implement.',
    3: 'If I were on the hiring side, I would add some more information to the included tests that the user can reflect on. Currently, my tests are all failing via the web tests with limited info to debug, and locally the same tests run fine via postman.',
  },
};

// Establish Port and Server
const PORT = 3000;
const app = express();

// Parse through incoming JSON data
app.use(express.json());

// Enable cors
app.use(cors({
  origin: 'https://app.ava.me',
  optionsSuccessStatus: 200,
}));

// ---------- Endpoints ----------

app.get('/', (req, res) => {
  res.status(200).sendFile(path.join(__dirname, '../../dist/index.html'));
});

// GET /ping
app.get('/ping', (req, res) => res.status(200).json({ ok: true, msg: 'pong' }));

// GET /info
app.get('/info', (req, res) => res.status(200).json({
  ok: true,
  author: data.personalInfo,
  frontend: { url: data.frontendUrl },
  language: 'node.js',
  sources: data.sources,
  answers: data.answers,
}));

// POST /mutations
app.post('/mutations',
  convController.verifyConversation,
  convController.addMutation,
  (req, res) => {

  });

// GET /conversations
app.get('/conversations', convController.getAll, (req, res) => {
  res
    .status(res.locals.response.ok ? 200 : 500)
    .json(res.locals.response);
});

// DELETE /conversations
app.delete('/conversations', convController.delete, (req, res) => {
  res
    .status(res.locals.response.ok ? 200 : 500)
    .json(res.locals.response);
});

// 404 error handler
app.use((req, res) => res.status(404).json('These are not the droids you are looking for.'));

app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
