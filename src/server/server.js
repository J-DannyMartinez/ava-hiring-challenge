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
    back: '',
  },
  answers: {
    1: '',
    2: '',
    3: '',
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
  // res
  //   .status(204)
  //   .json(res.locals.response);
});

// 404 error handler
app.use((req, res) => res.status(404).json('These are not the droids you are looking for.'));

app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
