import { useEffect, useRef, useState } from "react";
import Peer from "peerjs";
import "./App.css";

function App() {
  const [peerId, setPeerId] = useState("");
  const [remotePeerIdValue, setRemotePeerIdValue] = useState("");
  const remoteVideoRef = useRef(null);
  const currentUserVideoRef = useRef(null);
  const peerInstance = useRef(null);
  const [mediaStream, setMediaStream] = useState(null);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isMicrophoneOn, setIsMicrophoneOn] = useState(true);

  useEffect(() => {
    const peer = new Peer();

    peer.on("open", (id) => {
      setPeerId(id);
    });

    peer.on("call", (call) => {
      const getUserMedia = navigator.mediaDevices.getUserMedia;

      getUserMedia({ video: true, audio: true })
        .then((mediaStream) => {
          const audioTracks = mediaStream.getAudioTracks();
          audioTracks.forEach((track) => {
            track.applyConstraints({ echoCancellation: true });
          });

          setMediaStream(mediaStream);

          currentUserVideoRef.current.srcObject = mediaStream;
          currentUserVideoRef.current.play();

          const videoTracks = mediaStream.getVideoTracks();
          videoTracks.forEach((track) => {
            track.enabled = isCameraOn;
          });

          call.answer(mediaStream);

          call.on("stream", function (remoteStream) {
            remoteVideoRef.current.srcObject = remoteStream;
            remoteVideoRef.current.play();
          });
        })
        .catch((error) =>
          console.error("Error accessing media devices:", error)
        );
    });

    peerInstance.current = peer;
  }, [isCameraOn]);

  const call = (remotePeerId) => {
    const getUserMedia = navigator.mediaDevices.getUserMedia;

    getUserMedia({ video: true, audio: true })
      .then((mediaStream) => {
        setMediaStream(mediaStream);

        currentUserVideoRef.current.srcObject = mediaStream;
        currentUserVideoRef.current.play();

        const videoTracks = mediaStream.getVideoTracks();
        videoTracks.forEach((track) => {
          track.enabled = isCameraOn;
        });

        const call = peerInstance.current.call(remotePeerId, mediaStream);

        call.on("stream", (remoteStream) => {
          remoteVideoRef.current.srcObject = remoteStream;
          remoteVideoRef.current.play();
        });
      })
      .catch((error) => console.error("Error accessing media devices:", error));
  };

  const toggleCamera = () => {
    if (mediaStream) {
      const videoTracks = mediaStream.getVideoTracks();
      videoTracks.forEach((track) => {
        track.enabled = !track.enabled;
      });
      setIsCameraOn(!isCameraOn);
    }
  };

  const toggleMicrophone = () => {
    if (mediaStream) {
      const audioTracks = mediaStream.getAudioTracks();
      audioTracks.forEach((track) => {
        track.enabled = !track.enabled;
      });
      setIsMicrophoneOn(!isMicrophoneOn);
    }
  };

  return (
    <div className="App">
      <h1>Current user id is {peerId}</h1>
      <input
        type="text"
        value={remotePeerIdValue}
        onChange={(e) => setRemotePeerIdValue(e.target.value)}
      />
      <button onClick={() => call(remotePeerIdValue)}>Call</button>
      <button onClick={toggleCamera}>
        {isCameraOn ? "Turn Off Camera" : "Turn On Camera"}
      </button>
      <button onClick={toggleMicrophone}>
        {isMicrophoneOn ? "Turn Off Microphone" : "Turn On Microphone"}
      </button>
      <div>
        <video ref={currentUserVideoRef} />
      </div>
      <div>
        <video ref={remoteVideoRef} />
      </div>
    </div>
  );
}

export default App;
