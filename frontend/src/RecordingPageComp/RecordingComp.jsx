/* eslint-disable react/prop-types */

import { AudioRecorder, useAudioRecorder } from "react-audio-voice-recorder";
import { useContext, useEffect, useRef } from "react";
import { UserContext } from "../UserContext.js";
import "./Microphone.css";

function RecordingComp() {
  const { user } = useContext(UserContext);
  //Calling Midisounds to play a chord

  //Formula that converts frequency in HZ to its closes MIDI note number

  const recorderControls = useAudioRecorder();
  const reader = new FileReader();
  const audioContextRef = useRef(new AudioContext()); // Use AudioContext for Web-Audio functions

  const addAudioElement = (blob) => {
    const MAX_SIZE = 0.25 * 1024 * 1024; // .25mb max size
    // Check if blob is more than .25mb
    if (blob.size > MAX_SIZE) {
      alert("The file size exceeds the limit of .25MB.");
      return; // Stop function if too large
    }
    reader.readAsDataURL(blob);
    let audiodata;
    reader.onload = function (event) {
      try {
        audiodata = event.target.result.split(",")[1]; // Stores part of URL after the comma
        if (!audiodata) {
          throw new Error("No data after the comma");
        }
      } catch (error) {
        alert("The file size exceeds the limit of .25MB." + error);
      }
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
  };

  useEffect(() => {
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
