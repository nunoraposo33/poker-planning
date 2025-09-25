const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

const ALLOWED_VALUES = ["0", "2", "4", "8", "16", "32", "?", "coffee"];

let state = {
  round: 1,
  votes: {}
};

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// API: Get current state
app.get('/state', (req, res) => {
  res.json(state);
});

// API: Submit vote
app.post('/vote', (req, res) => {
  const { player, value } = req.body;
  if (!player || !ALLOWED_VALUES.includes(value)) {
    return res.status(400).json({ error: 'Invalid player or vote value.' });
  }
  state.votes[player] = value;
  res.json({ message: 'Vote recorded.' });
});

// POST /clear - resets everything
app.post('/clear', (req, res) => {
  state = {
    round: 1,
    votes: {}
  };
  res.json({ message: 'State cleared.' });
});

// API: Move to next round
app.post('/next', (req, res) => {
  state.round++;
  state.votes = {};
  res.json({ message: 'Started new round.', round: state.round });
});

app.listen(PORT, () => {
  console.log(`Poker Planning server running at http://localhost:${PORT}`);
});
