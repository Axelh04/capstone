/* eslint-disable react/prop-types */

import { useState, useEffect } from "react";
import "./SimilarSounds.css";

function SimilarSounds({ note, playbackDuration }) {
  const duration = Math.floor(playbackDuration);
  const [soundList, setSoundList] = useState([]);
  const [isLoadingSounds, setIsLoadingSounds] = useState(false);

  useEffect(() => {
    const midiNote = Math.floor(note);
    fetchSounds(midiNote);
  }, [note]);

  const fetchSounds = async (midinote) => {
    //Freesound API request
    try {
      setIsLoadingSounds(true);
      console.log(note);
      if (note != 0) {
        const API_KEY = import.meta.env.VITE_APP_API_KEY;
        const response = await fetch(
          `https://freesound.org/apiv2/search/text/?token=${API_KEY}&filter=duration:${duration}%20ac_note_midi:${midinote}&fields=name,previews`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        } else {
          const soundData = await response.json();
          setSoundList(soundData.results);
          setIsLoadingSounds(false);
        }
      } else {
        console.error("No MIDI note selected");
      }
    } catch (error) {
      console.error("Error searching for sounds:", error);
      alert("Error searching for sounds. Please try again. " + error.message);
    }
  };

  return (
    <>
      <div id="fetch-sounds-button">Similar Sounds</div>
      {isLoadingSounds ? (
        <div className="similarsounds-spinner-container">
          <div className="playbutton-spinner"></div>
        </div>
      ) : (
        <div id="similar-sounds-list">
          {soundList.length > 0 ? (
            soundList.map((sound, index) => (
              <div key={index} id="sound-item">
                <audio controls src={sound.previews["preview-lq-mp3"]}></audio>
              </div>
            ))
          ) : (
            <></>
          )}
        </div>
      )}
      <div id = "similarsounds-shadow-box-bottom"></div>
    </>
  );
}

export default SimilarSounds;
