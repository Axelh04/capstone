/* eslint-disable react/prop-types */

import { useState } from "react";
import "./SimilarSounds.css";

function SimilarSounds({ playbackDuration }) {
  const duration = Math.floor(playbackDuration);
  const [soundList, setSoundList] = useState([]);
  const [isLoadingSounds, setIsLoadingSounds] = useState(false);

  const fetchSounds = async () => {
    //Loading State
    setIsLoadingSounds(true);
    setTimeout(() => {
      setIsLoadingSounds(false);
    }, 2000);

    //Freesound API request
    try {
      const API_KEY = import.meta.env.VITE_APP_API_KEY;
      const response = await fetch(
        `https://freesound.org/apiv2/search/text/?token=${API_KEY}&filter=duration:${duration}&fields=name,previews`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const soundData = await response.json();
      setSoundList(soundData.results);
    } catch (error) {
      console.error("Error searching for sounds:", error);
      alert("Error searching for sounds. Please try again. " + error.message);
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
    </>
  );
}

export default SimilarSounds;
