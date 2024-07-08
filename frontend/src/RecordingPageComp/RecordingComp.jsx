import { AudioRecorder, useAudioRecorder } from "react-audio-voice-recorder";
import { useContext } from "react";
import { UserContext } from "../UserContext.js";

function RecordingComp() {
  const { user } = useContext(UserContext);

  const recorderControls = useAudioRecorder();
  const reader = new FileReader();

  const addAudioElement = (blob) => {
    reader.readAsDataURL(blob);
    const src = URL.createObjectURL(blob);
    setAudioSource(src);

    reader.onload = function (event) {
      const audiodata = event.target.result.split(",")[1]; //Stores part of URL after the ,
      fetch(`http://localhost:3000/users/${user.id}/audios/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ audios: audiodata }),
      });
    };
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
