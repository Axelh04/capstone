/* eslint-disable react/prop-types */
import { useEffect, useRef } from "react";
import { PitchDetector } from "pitchy";

function PlaybackContainer({
  midiSounds,
  note,
  playbackDuration,
  selectedInstrument,
  selectedBlob,

  setNote,
  setPlaybackDuration,
}) {
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

    console;

    if (!blob) {
      return;
    } else {
      // Use blob.arrayBuffer() method to read blob as ArrayBuffer
      blob
        .arrayBuffer()
        .then((arrayBuffer) => {
          audioContextRef.current.decodeAudioData(arrayBuffer, (buffer) => {
            const input = buffer.getChannelData(0); // mono audio
            const detector = PitchDetector.forFloat32Array(input.length);
            const [pitch] = detector.findPitch(
              input,
              audioContextRef.current.sampleRate
            );
            frequencyToMIDINoteNumber(pitch);
            setPlaybackDuration(buffer.duration);
          });
        })
        .catch((error) => {
          console.error("Error reading audio blob:", error);
        });
    }
  };

  const playTestInstrument = () => {
    midiSounds.current.playChordNow(
      selectedInstrument,
      [note],
      playbackDuration
    );
  };

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
