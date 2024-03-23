import React, { useEffect, useRef } from 'react';
import io from "socket.io-client";
import Peer from "simple-peer";

const socket = io("http://localhost:3000");

function VideoCall1() {
    
    const localVideoRef = useRef();
    const remoteVideoRef = useRef();
    let peer = null;

    useEffect(() => {
        navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true
        }).then((stream) => {
            localVideoRef.current.srcObject = stream;
            // Triggered when the local stream is ready and connected to the signaling server

            //initializing peer connection
            peer = new Peer({
                initiator: true,
                trickle: false,
                stream: stream
            });

            peer.on("signal", (data) => {
                socket.emit("offer", data);
            });

            peer.on("stream", (stream) => {
                remoteVideoRef.current.srcObject = stream;
            });

            socket.on("answer",(data) => {
                peer.signal(data);
            });

            socket.on("icecandidate", (data) => {
                peer.signal(data);
            });
        }).catch((error) => {
            console.log("Error is: ", error);
        });

        return () => {
            peer.destroy();
        }
    },[])

  return (
    <div>
        <video ref={localVideoRef}  autoPlay playsInline muted src=""></video>
        <video ref={remoteVideoRef} autoPlay playsInline muted src=""></video>
    </div>
  )
}

export default VideoCall1