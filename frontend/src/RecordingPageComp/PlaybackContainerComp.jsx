/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from "react";
import { PitchDetector } from "pitchy";

function PlaybackContainer({
  midiSounds,
  playbackDuration,
  selectedInstrument,
  selectedBlob,

  setNote,
  setPlaybackDuration,
}) {
  const [midiNotes, setMidiNotes] = useState([]);
  const audioContextRef = useRef(new AudioContext());

  function frequencyToMIDINoteNumber(frequency) {
    setNote(Math.round(69 + 12 * Math.log2(frequency / 440)));
  }

  useEffect(() => {
    handlePitchDetection(selectedBlob);
  }, [selectedBlob]);

  const handlePitchDetection = (blob) => {
    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext();
    }
    if (!blob) {
      return;
    } else {
      const frameSize = 2048; // Increased frame size
      const overlap = 1024; // Increased overlap
      const sampleRate = audioContextRef.current.sampleRate;
      blob
        .arrayBuffer()
        .then((arrayBuffer) => {
          audioContextRef.current.decodeAudioData(
            arrayBuffer,
            (buffer) => {
              let input = buffer.getChannelData(0); // mono audio
              // Pre-processing: Simple normalization (example)
              let maxVal = 0;
              for (let i = 0; i < input.length; i++) {
                const absValue = Math.abs(input[i]);
                if (absValue > maxVal) {
                  maxVal = absValue;
                }
              }
              if (maxVal > 0) {
                input = input.map((x) => x / maxVal);
              }
              const singlePitchDetector = PitchDetector.forFloat32Array(
                input.length
              );
              const [pitch] = singlePitchDetector.findPitch(
                input,
                audioContextRef.current.sampleRate
              );

              frequencyToMIDINoteNumber(pitch);
              setPlaybackDuration(buffer.duration);

              const multiPitchDetector =
                PitchDetector.forFloat32Array(frameSize);
              const pitches = [];
              const times = [];
              for (
                let i = 0;
                i < input.length - frameSize;
                i += frameSize - overlap
              ) {
                const frame = input.slice(i, i + frameSize);
                const [pitch, clarity] = multiPitchDetector.findPitch(
                  frame,
                  sampleRate
                );
                if (clarity > 0.5) {
                  const midiNote = Math.round(69 + 12 * Math.log2(pitch / 440));
                  pitches.push(midiNote);
                  const time = i / sampleRate; // Calculate the time of the current frame
                  times.push(time);
                }
              }
              setMidiNotes(pitches);
              console.log("Detected pitches:", pitches, times);
            },
            (error) => {
              console.error("Error decoding audio data:", error);
            }
          );
        })
        .catch((error) => {
          console.error("Error reading audio blob:", error);
        });
    }
  };

  let i = 0;
  function playTestInstrument() {
    //loop over MIDInotes array
    const frameSize = 2048;
    const overlap = 1024;
    const sampleRate = audioContextRef.current.sampleRate;

    const delay = ((frameSize - overlap) / sampleRate) * 1000;

    setTimeout(function () {
      if (i >= midiNotes.length - 1) {
        console.log("All notes played.f");
        i = 0;
        return;
      }
      const newNote = midiNotes[i];
      midiSounds.current.playChordNow(
        selectedInstrument,
        [newNote],
        playbackDuration
      );
      i++;
      if (i < midiNotes.length) {
        playTestInstrument();
      }
    }, delay);
  }

  return (
    <div id="instrument-sound-container">
      <button onClick={playTestInstrument}>Play</button>
      {selectedInstrument !== "" ? (
        <div>
          Selected:
          {
            midiSounds.current.player.loader.instrumentInfo(selectedInstrument)
              .title
          }
        </div>
      ) : (
        <div> No Instrument Selected.</div>
      )}
    </div>
  );
}

export default PlaybackContainer;
