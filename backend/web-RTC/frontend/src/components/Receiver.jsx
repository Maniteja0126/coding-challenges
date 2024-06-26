import  { useEffect, useState } from "react";
import {Video} from "./Video";

export const Receiver = () => {
    const [stream, setStream] = useState(null);

    useEffect(() => {
        const socket = new WebSocket('ws://localhost:8080');

        socket.onopen = () => {
            socket.send(JSON.stringify({
                type: 'receiver'
            }));
        };

        startReceiving(socket);

        return () => {
            socket.close();
        };
    }, []);

    const startReceiving = (socket) => {
        const pc = new RTCPeerConnection();

        pc.ontrack = (event) => {
            const incomingStream = event.streams[0];
            setStream(incomingStream);
        };

        socket.onmessage = async (event) => {
            const message = JSON.parse(event.data);
            if (message.type === 'createOffer') {
                await pc.setRemoteDescription(new RTCSessionDescription(message.sdp));
                const answer = await pc.createAnswer();
                await pc.setLocalDescription(answer);
                socket.send(JSON.stringify({
                    type: 'createAnswer',
                    sdp: answer
                }));
            } else if (message.type === 'iceCandidate') {
                await pc.addIceCandidate(new RTCIceCandidate(message.candidate));
            }
        };
    };

    return (
        <div>
            Receiver
            {stream && <Video stream={stream} showButton ={true}/>}
        </div>
    );
};

