/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react"
import { Video } from "./Video";
export const Sender = () => {
    const [socket, setSocket] = useState(null);
    const [pc, setPC] = useState(null);
    const [stream , setStream] = useState(null);

    useEffect(() => {
        const socket = new WebSocket('ws://localhost:8080');
        setSocket(socket);
        socket.onopen = () => {
            socket.send(JSON.stringify({
                type: 'sender'
            }));
        }
    }, []);

    const initiateConn = async () => {

        if (!socket) {
            alert("Socket not found");
            return;
        }

        socket.onmessage = async (event) => {
            const message = JSON.parse(event.data);
            if (message.type === 'createAnswer') {
                await pc.setRemoteDescription(message.sdp);
            } else if (message.type === 'iceCandidate') {
                pc.addIceCandidate(message.candidate);
            }
        }

        const pc = new RTCPeerConnection();
        setPC(pc);
        pc.onicecandidate = (event) => {
            if (event.candidate) {
                socket?.send(JSON.stringify({
                    type: 'iceCandidate',
                    candidate: event.candidate
                }));
            }
        }

        pc.onnegotiationneeded = async () => {
            const offer = await pc.createOffer();
            await pc.setLocalDescription(offer);
            socket?.send(JSON.stringify({
                type: 'createOffer',
                sdp: pc.localDescription
            }));
        }

        getCameraStreamAndSend(pc);
    }

    const getCameraStreamAndSend = (pc) => {
        navigator.mediaDevices.getUserMedia({ video: true , audio : true}).then((stream) => {
            setStream(stream);
            stream.getTracks().forEach((track) => {
                pc?.addTrack(track , stream);
            });
        });
    }

    return <div>
        Sender
        <button onClick={initiateConn}> Send data </button>
        {stream && <Video stream={stream} showButton={false} /> }
    </div>
}