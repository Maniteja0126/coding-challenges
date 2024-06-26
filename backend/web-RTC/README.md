## WebRTC

## Introduction

Node.js for the Signaling server. It will be a websocket server that supports 3 types of messages
- createOffer
- createAnswer
- addIceCandidate

React + PeerConnectionObject on the frontend

## Connecting the two sides
The steps to create a webrtc connection between 2 sides includes - 

1. Browser 1 creates an `RTCPeerConnection`
2. Browser 1 creates an `offer`
3. Browser 1 sets the `local description` to the offer
4. Browser 1 sends the offer to the other side through `signaling server`
5. Browser 2 receives the `offer` from the `signaling server`
6. Browser 2 sets the `remote description` to the `offer`
7. Browser 2 creates an `answer`
8. Browser 2 sets the `local description` to be the `answer`
9. Browser 2 sends the `answer` to the other side through the `signaling server`
10. Browser 1 receives the `answer` and sets the `remote description`

This is just to establish the p2p connection b/w the two parties

To actually send media, we have to
- Ask for camera/mic permissions
- Get the `audio` and `video` streams
- Call `addTrack` on the `pc`
- This would trigger a `onTrack` callback on the other side
