// server.js

const express = require('express');
const http = require('http');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const server = http.createServer(app);
const port = 4001;

app.use(cors());
app.use(bodyParser.json());

// Store the offer and answer data
let offerData = null;
let answerData = null;

// Endpoint to receive offer
app.post('/offer', (req, res) => {
  offerData = req.body.offer;
  res.status(200).send('Offer received');
});

// Endpoint to get offer
app.get('/offer', (req, res) => {
  res.status(200).json({ offer: offerData });
});

// Endpoint to receive answer
app.post('/answer', (req, res) => {
  answerData = req.body.answer;
  res.status(200).send('Answer received');
});

// Endpoint to get answer
app.get('/answer', (req, res) => {
  res.status(200).json({ answer: answerData });
});

// Endpoint to receive ICE candidate
app.post('/icecandidate', (req, res) => {
  const candidate = req.body.candidate;
  // Handle ICE candidate as needed
  // You might want to broadcast this candidate to the other peer
  res.status(200).send('ICE candidate received');
});

// Start the server
server.listen(port, () => {
  console.log(`Signaling server running on port ${port}`);
});
