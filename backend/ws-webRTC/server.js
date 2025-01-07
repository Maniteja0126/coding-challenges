const WebSocket = require("ws");
const express = require("express");
const app = express();
const http = require("http");
const path = require("path");

app.use(express.static(path.join(__dirname, "public")));
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

const server = http.createServer(app);

const wss = new WebSocket.Server({server});

wss.on("connection", (ws) => {
  ws.on("message", (message) => {
    console.log(`Received message => ${message}`);
    wss.clients.forEach((client) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });

  ws.on("close", () => {
    console.log("Client disconnected");
  });

  ws.on("error", (err) => {
    console.log(`Error: ${err}`);
  });
});


const PORT =  3000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

