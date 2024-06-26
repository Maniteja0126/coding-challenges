/* eslint-disable react/prop-types */
// Video.jsx
import  { useEffect, useRef } from "react";

export const Video = ({ stream , showButton }) => {
    const videoRef = useRef(null);

    useEffect(() => {
        if (videoRef.current && stream) {
            videoRef.current.srcObject = stream;
            // videoRef.current.autoPlay = true;
        }
    }, [stream]);

    const handleStart = () => {
        if (videoRef.current) {
            videoRef.current.play().catch(error => {
                console.error("Error attempting to play the video: ", error);
            });
        }
    };

    return (
        <div>
            <video ref={videoRef} autoPlay></video>
             {showButton &&  <button onClick={handleStart}>Share Video</button>}
        </div>
    );
};

