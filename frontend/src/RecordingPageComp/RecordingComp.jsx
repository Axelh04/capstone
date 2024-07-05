import { AudioRecorder, useAudioRecorder } from "react-audio-voice-recorder";
import { useContext,useEffect, useState } from "react";
import { UserContext } from "../UserContext.js";

function StoringAudio() {
  const { user } = useContext(UserContext);
  const [recordings, setRecordings] = useState([]);

  const recorderControls = useAudioRecorder();
  const reader = new FileReader();

  const addAudioElement = (blob) => {
    reader.readAsDataURL(blob);

    reader.onload = function (event) {
      const audiodata = event.target.result.split(",")[1];
      fetch(`http://localhost:3000/users/${user.id}/audios/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ audios: audiodata }),
      });
    };
  };

  useEffect(() => {
    fetchData();
  }, []);

  function convertToBlob(byteArray, mimeType) {
    const arrayBuffer = new Uint8Array(byteArray).buffer;
    return new Blob([arrayBuffer], { type: mimeType });
  }
  const fetchData = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/users/${user.id}/audios`,
        { method: "GET" }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      } else {
        const data = await response.json();
        const urls = data.map((item) => {
          const audioBlob = convertToBlob(item.audios.data, "audio/mp4");
          return URL.createObjectURL(audioBlob);
        });
        setRecordings(urls);
      }
    } catch (error) {
      alert("Failed to fetch audios. Please try again.");
    }
  };

  return (
    <div>
      <AudioRecorder
        onRecordingComplete={(blob) => addAudioElement(blob)}
        recorderControls={recorderControls}
        audioTrackConstraints={{
          noiseSuppression: true,
          echoCancellation: true,
        }}
        showVisualizer={true}
      />

      <button onClick={recorderControls.stopRecording}>Stop recording</button>
      <button onClick={fetchData}>fetch</button>

      <div>
        {recordings.length > 0 ? (
          recordings.map((url, index) => (
            <audio key={index} controls src={url} />
          ))
        ) : (
          <div>No Recordings found.</div>
        )}
      </div>
    </div>
  );
}

export default StoringAudio;
