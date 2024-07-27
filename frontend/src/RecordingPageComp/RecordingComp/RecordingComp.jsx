import { AudioRecorder, useAudioRecorder } from "react-audio-voice-recorder";
import { useContext, useEffect, useRef } from "react";
import { UserContext } from "../../UserContext.js";
import "./RecordingComp.css";

function RecordingComp() {
  const { user } = useContext(UserContext);

  const recorderControls = useAudioRecorder();
  const reader = new FileReader();
  const audioContextRef = useRef(new AudioContext());

  //Stores audio to user database
  const addAudioElement = (blob) => {
    const MAX_SIZE = 0.25 * 1024 * 1024;
    // Check if blob is more than .25mb
    if (blob.size > MAX_SIZE) {
      alert("The file size exceeds the limit of .25MB.");
      return;
    }
    reader.readAsDataURL(blob);
    let audiodata;
    reader.onload = function (event) {
      try {
        const parts = event.target.result.split(",");
        if (parts.length < 2) {
          throw new Error("No comma found in the data");
        }
        // Stores part of URL after the comma
        audiodata = parts[1];
      } catch (error) {
        alert("Error processing data: " + error.message);
      }
      fetch(`http://localhost:3000/users/${user.id}/audios/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ audios: audiodata }),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
        })
        .catch((error) => {
          alert("Failed to store audio: " + error.message);
        });
    };

    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext();
    }
  };

  useEffect(() => {
    //Stops Recording after 10 Seconds
    if (recorderControls.recordingTime >= 10) recorderControls.stopRecording();
  }, [recorderControls.recordingTime]);

  return (
    <>
      <div id="microphone-container">
        <AudioRecorder
          onRecordingComplete={(blob) => addAudioElement(blob)}
          recorderControls={recorderControls}
          audioTrackConstraints={{
            noiseSuppression: true,
            echoCancellation: true,
          }}
          showVisualizer={true}
        />
      </div>
    </>
  );
}

export default RecordingComp;
