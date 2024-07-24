/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from "react";
import { PitchDetector } from "pitchy";
import "./PlaybackSound.css";

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
              let input = buffer.getChannelData(0); // mono audio

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
              const filteredPitches = filterShortDurations(groupedPitches, 0.1); // Filter out short durations
              setMidiNotes(filteredPitches);

              //Single Pitch detector
              const singlePitchDetector = PitchDetector.forFloat32Array(
                input.length
              );
              const [pitch] = singlePitchDetector.findPitch(
                input,
                audioContextRef.current.sampleRate
              );
              //Values will be passed on to SimilarSounds
              setNote(frequencyToMIDINoteNumber(pitch));
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

  function groupPitches(pitches, sampleRate, hopSize) {
    const groupedPitches = [];
    let currentGroup = [];
    let nullCount = 0; // Counter for consecutive nulls
    let groupStartIndex = 0; // Index where the current group starts

    pitches.forEach((pitch, index) => {
      if (pitch !== null) {
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
          groupStartIndex = index; // Update start index for new group
          nullCount = 0;
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
    const startTime = startIndex * (hopSize / sampleRate); // Calculate start time based on index

    return { pitch: roundedPitch, duration, startTime };
  }

  function filterShortDurations(pitches, minDuration) {
    return pitches.filter((pitch) => pitch.duration >= minDuration);
  }

  const [timeoutId, setTimeoutId] = useState(null); // State to store the current timeout ID

  function playTestInstrument(pitchesArray) {
    if (pitchesArray.length === 0 || !isPlaying) return;

    let index = 0; // Initialize index to track the current note

    function playNextNote() {
      if (!isPlaying) return; // Stop if playback is stopped

      const { pitch, duration, startTime } = pitchesArray[index];
      midiSounds.current.playChordNow(
        selectedInstrument,
        [pitch],
        duration + 1
      );

      // Calculate the delay for next note
      index = (index + 1) % pitchesArray.length; // Loop back to  start
      const nextNote = pitchesArray[index];
      let delay;
      if (index === 0) {
        // If we're looping back to start, set delay to first group's startTime
        delay = nextNote.startTime * 1000;
      } else {
        // Else calculate delay based on the difference in start times
        delay = (nextNote.startTime - startTime) * 1000;
      }

      const id = setTimeout(playNextNote, delay);
      setTimeoutId(id); // Store new timeout ID
    }

    playNextNote(); // loop
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
      <button id="play-button" onClick={startPlayback}>
        <img
          alt="play-icon"
          src="https://www.pngall.com/wp-content/uploads/5/Black-Play-Button-PNG-Free-Download.png"
        ></img>
      </button>
      <button id="stop-button" onClick={stopPlayback}>
        <img
          alt="stop-button"
          src="https://www.clker.com/cliparts/n/K/j/Q/u/d/square-black-crystal-button-md.png"
        ></img>
      </button>
    </>
  );
}

export default PlaybackContainer;
