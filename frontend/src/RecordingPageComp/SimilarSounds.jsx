/* eslint-disable react/prop-types */

import { useState } from "react";
import "./SimilarSounds.css";

function SimilarSounds({ playbackDuration }) {
  const duration = Math.floor(playbackDuration);
  const [soundList, setSoundList] = useState([]);

  const fetchSounds = async () => {
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
      <div id="similar-sounds-list">
        {soundList.length > 0 ? (
          soundList.map((sound, i) => (
            <div key={i} id="sound-item">
              <audio controls src={sound.previews["preview-lq-mp3"]}></audio>
            </div>
          ))
        ) : (
          <div>No boards found.</div>
        )}
      </div>
    </>
  );
}

export default SimilarSounds;
