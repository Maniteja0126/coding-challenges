const { WebSocketServer } = require("ws");

const wss = new WebSocketServer({ port: 8080 });

let senderSocket = null;
let receiverSocket = null;

wss.on("connection", (ws) => {
  ws.on("message", (data) => {
    const message = JSON.parse(data);
    if (message.type === "sender") {
      senderSocket = ws;
    } else if (message.type === "receiver") {
      receiverSocket = ws;
    } else if (message.type === "createOffer") {
      receiverSocket.send(
        JSON.stringify({ type: "createOffer", sdp: message.sdp })
      );
    } else if (message.type === "createAnswer") {
      senderSocket.send(
        JSON.stringify({ type: "createAnswer", sdp: message.sdp })
      );
    } else if(message.type === 'iceCandidate'){
        if(ws === senderSocket){
            receiverSocket.send(JSON.stringify({type : 'iceCandidate' , candidate : message.candidate}));
        }else if(ws === receiverSocket){
            senderSocket.send(JSON.stringify({type : 'iceCandidate' , candidate : message.candidate}));
        }
    }
  });
});
