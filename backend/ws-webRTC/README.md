# WebRTC with WebSocket

This project demonstrates a simple WebRTC video chat application using WebSockets for signaling. The app allows two clients to establish a peer-to-peer video connection, exchange media streams, and communicate through WebSockets.

## Requirements

- **Node.js** (v14 or higher)
- **npm** (Node Package Manager)

## Setup and Installation

Follow these steps to set up and run the application locally.

### 1. Clone the Repository

Clone the repository to your local machine.

```bash
git clone https://github.com/Maniteja0126/coding-challenges.git
cd /backend/ws-webRTC
```


### 2. Install Dependencies
Install the required dependencies using npm:

```bash
npm install
```

### Run the Server

Start the server by running the following command :

```bash
node server.js
```
This will start the server at ```http://localhost:3000```.

### 4. Open the Application in the Browser
- Open a browser window and go to ```http://localhost:3000``` to access the WebRTC video chat application.
- You can open another browser window or use another device to test the WebRTC connection between two peers.



## Code Explanation

### server.js

The server.js file contains the backend logic. It uses Express to serve static files and WebSocket for real-time communication between clients.

```bash
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

```

- <b>```WebSocket Server ```</b>: We are using the ws module to create a WebSocket server that allows real-time communication between clients. The server listens for incoming messages from connected clients and broadcasts them to other clients. It helps in handling WebRTC signaling messages (such as offers, answers, and ICE candidates).

- <b>``` Express Server``` </b>: The Express server serves the HTML and JavaScript files stored in the public directory. The index.html is served at the root route (/), and all static files are served using express.static().

### index.html

The index.html file defines the structure of the webpage and the video elements for displaying local and remote streams.

```bash
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>WebRTC with WebSocket</title>
    <style>
      body {
        display: flex;
        flex-direction: column;
        align-items: center;
        font-family: Arial, sans-serif;
      }

      video {
        width: 50%;
        margin: 10px;
        border: 2px solid #ccc;
        border-radius: 8px;
      }
    </style>
  </head>
  <body>
    <h1>WebRTC with WebSocket</h1>
    <video id="localVideo" autoplay muted></video>
    <video id="remoteVideo" autoplay></video>
    <script src="script.js"></script>
  </body>
</html>
```
- <b> ```Video Elements```</b>: The HTML includes two ```<video>``` elements:
    - localVideo to display the local stream (muted).
    - remoteVideo to display the remote stream (incoming video).

- <b>```Script``` </b>: The external script.js file is loaded to handle the logic of WebRTC and WebSocket communication.



### script.js
The script.js file contains the client-side WebRTC logic and WebSocket communication for signaling. It establishes the peer-to-peer connection and handles media stream sharing between clients.

### 1. Selecting DOM elements and WebSocket connection

```bash
const localVideo = document.getElementById("localVideo");
const remoteVideo = document.getElementById("remoteVideo");
const ws = new WebSocket(`ws://${window.location.host}`);
```
### Explanation:
 - <b> ```localVideo and remoteVideo``` </b>: These variables reference the HTML ```<video>``` elements that will display the local and remote video streams, respectively.
 - <b>```ws```</b>: This creates a new WebSocket connection to the server using the current host (window.location.host), enabling real-time communication between the client and the server.


### 2. Initializing variables for media and WebRTC configuration
```bash 
let localStream;
let peerConnection;

const config = {
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
};
```
### Explanation:

- <b>```localStream```</b>: This variable will hold the media stream (audio and video) captured from the user's device.
peerConnection: This will hold the RTCPeerConnection object that facilitates the peer-to-peer WebRTC connection.
- <b>```config```</b>: Contains the WebRTC configuration for ICE (Interactive Connectivity Establishment). Here, a public ```STUN (Session Traversal Utilities for NAT)``` server is provided to help establish a connection between peers.

### 3. Accessing local media (camera and microphone)
```bash
navigator.mediaDevices
  .getUserMedia({ video: true, audio: true })
  .then((stream) => {
    localStream = stream;
    localVideo.srcObject = stream;
    console.log("Local stream initialized successfully");
  })
  .catch((error) => console.error("Error accessing media:", error));
```

### Explanation:

- <b>```navigator.mediaDevices.getUserMedia()```</b>: This method requests access to the user's camera and microphone. It returns a promise.
- <b>```.then((stream) => {...})```</b>: If successful, the local media stream is assigned to localStream, and the video stream is displayed in the localVideo element.
- <b>```.catch((error) => {...})```</b>: If the user denies access or there's an error, it logs the error.

### 4. WebSocket message handler (signaling messages)
```bash
ws.onmessage = async (message) => {
  try {
    const data =
      typeof message.data === "string"
        ? JSON.parse(message.data)
        : JSON.parse(await message.data.text());

    console.log("Received signaling message:", data);

    if (data.type === "offer") {
      console.log("Received offer. Creating PeerConnection...");
      peerConnection = createPeerConnection();

      await peerConnection.setRemoteDescription(
        new RTCSessionDescription(data.offer)
      );

      const answer = await peerConnection.createAnswer();
      await peerConnection.setLocalDescription(answer);
      ws.send(
        JSON.stringify({
          type: "answer",
          answer: peerConnection.localDescription,
        })
      );

      pendingCandidates.forEach((candidate) => {
        peerConnection.addIceCandidate(candidate).catch((error) => {
          console.error("Error adding ICE candidate:", error);
        });
      });
      pendingCandidates.length = 0;
    } else if (data.type === "answer") {
      console.log("Received answer. Setting remote description...");
      await peerConnection.setRemoteDescription(
        new RTCSessionDescription(data.answer)
      );
    } else if (data.type === "candidate") {
      console.log("Received ICE candidate:", data.candidate);
      const candidate = new RTCIceCandidate(data.candidate);

      if (peerConnection?.remoteDescription) {
        await peerConnection.addIceCandidate(candidate).catch((error) => {
          console.error("Error adding ICE candidate:", error);
        });
      } else {
        pendingCandidates.push(candidate);
        console.log("Queueing ICE candidate:", candidate);
      }
    }
  } catch (error) {
    console.error("Error parsing signaling message:", error);
  }
};
```
### Explanation:

- <b```>ws.onmessage```</b>: This is the WebSocket message handler. It processes incoming signaling messages (offer, answer, ICE candidate).
- <b>```Signaling message types```</b>:
  - <b>```offer```</b>: When the client receives an offer, it creates a peer connection, sets the remote description, creates an answer, and sends it back to the other peer.
  - <b> ```answer```</b>: When an answer is received, it sets the remote description to complete the connection setup.
  - <b> ```candidate```</b>: ICE candidates (network info) are received and added to the peer connection. If the connection is not yet set, candidates are queued and added once the peer connection is established.
- ```Note```: The pendingCandidates array stores ICE candidates before the connection is fully set up.

### 5. Creating a new ```RTCPeerConnection```
```bash
function createPeerConnection() {
  console.log("Creating PeerConnection...");

  const pc = new RTCPeerConnection(config);

  localStream.getTracks().forEach((track) => {
    pc.addTrack(track, localStream);
  });

  pc.ontrack = (event) => {
    console.log("Received remote track event:", event);
    if (event.streams && event.streams[0]) {
      remoteVideo.srcObject = event.streams[0];
      console.log("Remote video stream set.");
    } else {
      console.error("No remote stream in track event.");
    }
  };

  pc.onicecandidate = (event) => {
    if (event.candidate) {
      console.log("Sending ICE candidate:", event.candidate);
      ws.send(
        JSON.stringify({ type: "candidate", candidate: event.candidate })
      );
    } else {
      console.log("All ICE candidates sent.");
    }
  };

  pc.onconnectionstatechange = () => {
    console.log("Connection state:", pc.connectionState);
  };

  pc.oniceconnectionstatechange = () => {
    console.log("ICE connection state:", pc.iceConnectionState);
  };

  return pc;
}
```
### Explanation:

- <b>```createPeerConnection()```</b>: This function creates and returns a new RTCPeerConnection object.
- <b>```Adding tracks```</b>: The media tracks from localStream are added to the peer connection. This allows the local media to be sent to the remote peer.
- <b>```ontrack```</b>: This event handler is triggered when a remote track (video or audio) is received. The remote media stream is assigned to the remoteVideo element for display.
- <b>```onicecandidate``` </b>: This event handler is triggered when a new ICE candidate (network information) is found. The candidate is sent via WebSocket to the other peer.
- <b>```onconnectionstatechange & oniceconnectionstatechange```</b>: These handlers log changes in the connection state, helping with debugging and tracking connection status.


### 6. Creating an offer

```bash

async function createOffer() {
  peerConnection = createPeerConnection();

  if (!peerConnection) {
    console.error("Failed to create PeerConnection.");
    return;
  }

  const offer = await peerConnection.createOffer();
  await peerConnection.setLocalDescription(offer);
  console.log("Sending offer:", offer);
  ws.send(
    JSON.stringify({ type: "offer", offer: peerConnection.localDescription })
  );
}

```
### Explanation:
- <b> ```createOffer()``` </b>: This function creates an offer for a peer-to-peer connection.
  - First, a new peer connection is created.
  - The ```createOffer()``` method is called to generate an SDP (Session Description Protocol) offer, which is then set as the local description.
  - The offer is sent to the other peer through WebSocket.

### 7. Initiating the offer creation after a delay
```bash
setTimeout(createOffer, 1000);
```
### Explanation:
- This line calls the createOffer function after a 1-second delay. This is done to give the application enough time to set up the WebRTC peer connection before creating the offer.