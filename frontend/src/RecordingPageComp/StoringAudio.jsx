import { AudioRecorder, useAudioRecorder } from "react-audio-voice-recorder";
import { useContext } from "react";
import { UserContext } from "../UserContext.js";

function StoringAudio() {
  const { user } = useContext(UserContext);
  const recorderControls = useAudioRecorder();
  const reader = new FileReader();

  const addAudioElement = (blob) => {
    const url = URL.createObjectURL(blob);
    const audio = document.createElement("audio");
    audio.src = url;
    audio.controls = true;
    document.body.appendChild(audio);
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

export default StoringAudio;
