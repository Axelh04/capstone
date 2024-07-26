/* eslint-disable react/prop-types */

import { useState } from "react";
import "./SimilarSounds.css";

function SimilarSounds({ playbackDuration }) {
  const duration = Math.floor(playbackDuration);
  const [soundList, setSoundList] = useState([]);
  const [isLoadingSounds, setIsLoadingSounds] = useState(false);

  const fetchSounds = async () => {
    setIsLoadingSounds(true); // Start loading
    // Simulate loading time or wait for an actual event that confirms the instrument is ready
    setTimeout(() => {
      setIsLoadingSounds(false); // Stop loading after 1 second
    }, 2000);
    try {
      const API_KEY = import.meta.env.VITE_APP_API_KEY;
      const response = await fetch(
        `https://freesound.org/apiv2/search/text/?token=${API_KEY}&filter=duration:${duration}&fields=name,previews`
      );
      const soundData = await response.json();
      setSoundList(soundData.results);
    } catch (error) {
      alert("Error searching for sounds. Please try again.", error);
    }
  };

  return (
    <>
      <button id="fetch-sounds-button" onClick={fetchSounds}>
        Get Similar Sounds
      </button>
      {isLoadingSounds ? (
        <div className="similarsounds-spinner-container">
          <div className="playbutton-spinner"></div>
        </div>
      ) : (
        <div id="similar-sounds-list">
          {soundList.length > 0 ? (
            soundList.map((sound, i) => (
              <div key={i} id="sound-item">
                <audio controls src={sound.previews["preview-lq-mp3"]}></audio>
              </div>
            ))
          ) : (
            <div></div>
          )}
        </div>
      )}
    </>
  );
}

export default SimilarSounds;
