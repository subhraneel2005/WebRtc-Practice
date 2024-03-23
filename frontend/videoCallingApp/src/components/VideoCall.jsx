import React, { useEffect, useRef } from 'react';
import axios from 'axios';

const VideoCall = () => {
  const localVideoRef = useRef();
  const remoteVideoRef = useRef();
  let peer = null;

  useEffect(() => {
    const initCall = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        localVideoRef.current.srcObject = stream;

        peer = new RTCPeerConnection();

        peer.onicecandidate = async (event) => {
          if (event.candidate) {
            await axios.post('http://localhost:4001/icecandidate', {
              candidate: event.candidate,
            });
          }
        };

        peer.ontrack = (event) => {
          remoteVideoRef.current.srcObject = event.streams[0];
        };

        const offer = await peer.createOffer();
        await peer.setLocalDescription(offer);
        await axios.post('http://localhost:4001/offer', {
          offer: offer,
        });

        // Listen for answer
        axios.get('http://localhost:4001/answer')
          .then((response) => {
            const { answer } = response.data;
            peer.setRemoteDescription(answer);
          })
          .catch((error) => {
            console.error('Error receiving answer:', error);
          });

        // Listen for ICE candidates
        axios.get('http://localhost:4001/icecandidate')
          .then((response) => {
            const { candidate } = response.data;
            peer.addIceCandidate(new RTCIceCandidate(candidate));
          })
          .catch((error) => {
            console.error('Error receiving ICE candidate:', error);
          });
      } catch (error) {
        console.error('Error accessing media devices:', error);
      }
    };

    initCall();

    return () => {
      if (peer) {
        peer.close();
      }
    };
  }, []);

  return (
    <div>
      <video ref={localVideoRef} autoPlay playsInline></video>
      <video ref={remoteVideoRef} autoPlay playsInline></video>
    </div>
  );
};

export default VideoCall;
