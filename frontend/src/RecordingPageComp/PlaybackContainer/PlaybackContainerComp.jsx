/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from "react";
import "./PlaybackContainer.css";

function PlaybackContainer({
  midiSounds,
  selectedInstrument,
  selectedBlob,
  setNote,
  setPlaybackDuration,
}) {
  const [midiNotes, setMidiNotes] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);

  const audioContextRef = useRef(new AudioContext());

  function frequencyToMIDINoteNumber(frequency) {
    return Math.round(69 + 12 * Math.log2(frequency / 440));
  }

  useEffect(() => {
    handlePitchDetection(selectedBlob);
    stopPlayback();
  }, [selectedBlob]);

  const handlePitchDetection = (blob) => {
    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext();
    }
    if (!blob) {
      return;
    } else {
      const sampleRate = audioContextRef.current.sampleRate;
      blob
        .arrayBuffer()
        .then((arrayBuffer) => {
          audioContextRef.current.decodeAudioData(
            arrayBuffer,
            (buffer) => {
              let input = buffer.getChannelData(0);

              // Pre-processing: Simple normalization
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

              //Multipitch Detector
              const windowSize = 1024;
              const hopSize = 512;
              const pitches = analyzePitchOverTime(
                input,
                sampleRate,
                windowSize,
                hopSize
              );

              const groupedPitches = groupPitches(pitches, sampleRate, hopSize);
              const filteredPitches = filterShortDurations(groupedPitches, 0.1);

              setMidiNotes(filteredPitches);
              singleNoteDetector(filteredPitches);
              setPlaybackDuration(buffer.duration);
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

  function singleNoteDetector(filteredPitches) {
    if (filteredPitches.length === 0) {
      return;
    }
    const total = filteredPitches.reduce(
      (acc, pitchData) => acc + pitchData.pitch,
      0
    );
    const averagePitch = total / filteredPitches.length;
    setNote(averagePitch);
  }

  function analyzePitchOverTime(buffer, sampleRate, windowSize, hopSize) {
    const pitches = [];

    for (let start = 0; start + windowSize <= buffer.length; start += hopSize) {
      let windowBuffer = buffer.slice(start, start + windowSize);
      const pitch = yin(windowBuffer, sampleRate);
      if (pitch) {
        const midiNote = frequencyToMIDINoteNumber(pitch);
        pitches.push(midiNote);
      } else {
        pitches.push(null);
      }
    }
    return pitches;
  }

  // Takes in audio buffer data and performs an operation that compares two versions of the audio data
  // Uses lag between wavelength data to determine when a vocal pitch is detected, if so this returns that frequency in hz
  // Performs function at specific slice determined by the analyzePitchOverTime algorithim
  // Inspired by Yin's mathematical algorithim for pitch detection
  function yin(buffer, sampleRate) {
    const threshold = 0.15; // Threshold for determining a clear pitch
    const bufferSize = buffer.length;
    const halfBufferSize = Math.floor(bufferSize / 2); // Half the buffer size for autocorrelation
    let cumulativeSum = 0; // Cumulative sum for normalized square difference function
    let bestTau = 0; // Best candidate for fundamental lag (tau)
    let bestEstimate = threshold; // Best pitch estimate based on threshold

    // Calculate the squared differences for different lags
    const difference = new Float32Array(halfBufferSize);
    for (let tau = 0; tau < halfBufferSize; tau++) {
      for (let i = 0; i < halfBufferSize; i++) {
        const delta = buffer[i] - buffer[i + tau];
        difference[tau] += delta * delta;
      }
    }

    // Compute cumulative mean normalized difference function (CMNDF)
    const cmndf = new Float32Array(halfBufferSize);
    cmndf[0] = 1; // Initialize first value to 1 (perfect correlation)
    for (let tau = 1; tau < halfBufferSize; tau++) {
      cumulativeSum += difference[tau];
      cmndf[tau] = (difference[tau] * tau) / cumulativeSum;
    }

    // Find smallest value of tau that gives a minimum of CMNDF below threshold
    for (let tau = 1; tau < halfBufferSize; tau++) {
      if (cmndf[tau] < bestEstimate) {
        bestTau = tau;
        bestEstimate = cmndf[tau];
        if (bestEstimate < threshold) {
          // Make sure this is true local minimum
          while (tau + 1 < halfBufferSize && cmndf[tau + 1] < cmndf[tau]) {
            tau++;
          }
          bestTau = tau;
          break;
        }
      }
    }

    // If the best candidate is valid, return the corresponding frequency
    if (bestTau === 0 || cmndf[bestTau] >= threshold) {
      return null; // No clear pitch found
    } else {
      return sampleRate / bestTau; // Convert lag into frequency
    }
  }

  // Function groupsPitches joins pitches seperated by null more than 7 values in pitches array
  // Need this to determine what note the user was most likely trying to sing
  function groupPitches(pitches, sampleRate, hopSize) {
    const groupedPitches = [];
    let currentGroup = [];
    let nullCount = 0;
    let groupStartIndex = 0;

    pitches.forEach((pitch, index) => {
      if (pitch !== null) {
        // Pauses in between each vocal note correlate to more than 7 consecutive null values in pitches array
        // Calculated through trial and error
        if (nullCount >= 7) {
          if (currentGroup.length > 0) {
            const groupedPitch = processPitchGroup(
              currentGroup,
              groupStartIndex,
              sampleRate,
              hopSize
            );
            if (groupedPitch) {
              groupedPitches.push(groupedPitch);
            }
            currentGroup = [];
          }
          groupStartIndex = index;
        }
        currentGroup.push(pitch);
        nullCount = 0;
      } else {
        nullCount++;
      }
    });

    if (currentGroup.length > 0) {
      const groupedPitch = processPitchGroup(
        currentGroup,
        groupStartIndex,
        sampleRate,
        hopSize
      );
      if (groupedPitch) {
        groupedPitches.push(groupedPitch);
      }
    }

    return groupedPitches;
  }

  function processPitchGroup(pitchGroup, startIndex, sampleRate, hopSize) {
    if (pitchGroup.length === 0) return null;
    const averagePitch =
      pitchGroup.reduce((acc, pitch) => acc + pitch, 0) / pitchGroup.length;
    const roundedPitch = Math.round(averagePitch);
    const duration = pitchGroup.length * (hopSize / sampleRate);
    const startTime = startIndex * (hopSize / sampleRate);

    return { pitch: roundedPitch, duration, startTime };
  }

  function filterShortDurations(pitches, minDuration) {
    return pitches.filter((pitch) => pitch.duration >= minDuration);
  }

  const [timeoutId, setTimeoutId] = useState(null);

  function playTestInstrument(pitchesArray) {
    if (pitchesArray.length === 0 || !isPlaying) return;

    let index = 0;

    function playNextNote() {
      if (!isPlaying) return;

      const { pitch, duration, startTime } = pitchesArray[index];
      midiSounds.current.playChordNow(
        selectedInstrument,
        [pitch],
        duration + 1
      );

      // Calculate the delay for next note
      index = (index + 1) % pitchesArray.length;
      const nextNote = pitchesArray[index];
      let delay;
      if (index === 0) {
        delay = nextNote.startTime * 1000;
      } else {
        delay = (nextNote.startTime - startTime) * 1000;
      }

      const id = setTimeout(playNextNote, delay);
      setTimeoutId(id);
    }

    playNextNote();
  }

  function startPlayback() {
    setIsPlaying(true);
    playTestInstrument(midiNotes);
  }

  function stopPlayback() {
    setIsPlaying(false);
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
  }

  return (
    <>
      <div id="selected-instrument-text">
        {selectedInstrument !== "" ? (
          <div>
            Selected: &nbsp;
            <span id="selected-instrument-title">
              {
                midiSounds.current.player.loader.instrumentInfo(
                  selectedInstrument
                ).title
              }
            </span>
          </div>
        ) : (
          <div> No Instrument Selected.</div>
        )}
      </div>
      <button id= {isPlaying ? "play-button-playing" : "play-button-stopped"} onClick={startPlayback}>
        <img alt="play-icon" src="/play-button.png"></img>
      </button>
      <button id="stop-button" onClick={stopPlayback}>
        <img alt="stop-button" src="/stop-square.png"></img>
      </button>
    </>
  );
}

export default PlaybackContainer;
