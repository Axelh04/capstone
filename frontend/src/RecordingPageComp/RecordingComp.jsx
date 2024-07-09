import { AudioRecorder, useAudioRecorder } from "react-audio-voice-recorder";
import { useContext, useRef } from "react";
import { UserContext } from "../UserContext.js";
import { PitchDetector } from "pitchy";

function RecordingComp() {
  const { user } = useContext(UserContext);

  const recorderControls = useAudioRecorder();
  const reader = new FileReader();
  const audioContextRef = useRef(new AudioContext()); // Use useRef to persist the AudioContext

  const addAudioElement = (blob) => {
    const src = URL.createObjectURL(blob);
    setAudioSource(src);
    reader.readAsDataURL(blob);
    reader.onload = function (event) {
      const audiodata = event.target.result.split(",")[1]; //Stores part of URL after ,
      fetch(`http://localhost:3000/users/${user.id}/audios/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ audios: audiodata }),
      });
    };

    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext();
    }

    // Use blob.arrayBuffer() method to read blob as ArrayBuffer
    blob
      .arrayBuffer()
      .then((arrayBuffer) => {
        audioContextRef.current.decodeAudioData(arrayBuffer, (buffer) => {
          const input = buffer.getChannelData(0); // mono audio
          const detector = PitchDetector.forFloat32Array(input.length);
          const [pitch, clarity] = detector.findPitch(
            input,
            audioContextRef.current.sampleRate
          );
          console.log(`Detected pitch: ${pitch} Hz, Clarity: ${clarity}`);
        });
      })
      .catch((error) => {
        console.error("Error reading audio blob:", error);
      });
  };

  function setAudioSource(audioSrc) {
    // Try to find an existing audio element by its ID
    let audio = document.getElementById("myAudioPlayer");

    // If doesn't exist, create it and append it to the body
    if (!audio) {
      audio = document.createElement("audio");
      audio.id = "myAudioPlayer"; // Set an ID for easy retrieval
      audio.controls = true;
      document.body.appendChild(audio);
    }

    // update the source of the audio element
    audio.src = audioSrc;
  }

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
    </div>
  );
}

export default RecordingComp;
