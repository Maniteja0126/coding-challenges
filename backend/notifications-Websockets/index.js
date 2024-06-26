const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.render('index');
});

// Endpoint to send notifications
app.post('/send-notification', (req, res) => {
  const message = req.body.message;
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
  res.sendStatus(200);
});

wss.on('connection', (ws) => {
  console.log('A new client connected!');

  ws.on('message', (message) => {
    console.log(`Received message: ${message}`);
  });

  // Send a welcome message to the client
  ws.send('Welcome to the real-time notification system!');
});

server.listen(3000, () => {
  console.log('Server is listening on port 3000');
});
