const localVideo = document.getElementById("localVideo");
const remoteVideo = document.getElementById("remoteVideo");
const ws = new WebSocket(`ws://${window.location.host}`);

let localStream;
let peerConnection;

const config = {
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
};

const pendingCandidates = [];

navigator.mediaDevices
  .getUserMedia({ video: true, audio: true })
  .then((stream) => {
    localStream = stream;
    localVideo.srcObject = stream;
    console.log("Local stream initialized successfully");

   
  })
  .catch((error) => console.error("Error accessing media:", error));

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

setTimeout(createOffer, 1000);
