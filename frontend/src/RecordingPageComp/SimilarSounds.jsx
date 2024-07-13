/* eslint-disable react/prop-types */

import { useState } from "react";

function SimilarSounds({ note, playbackDuration }) {
  const duration = Math.floor(playbackDuration);
  const [soundList, setSoundList] = useState([]);

  const fetchSounds = async () => {
    try {
      const API_KEY = import.meta.env.VITE_APP_API_KEY;
      const response = await fetch(
        `https://freesound.org/apiv2/search/text/?token=${API_KEY}&query=piano&filter=duration:${duration}%20ac_note_midi:${note}&fields=name,previews`
      );
      const soundData = await response.json();
      setSoundList(soundData.results);
    } catch (error) {
      alert("Error searching for sounds. Please try again.");
    }
  };

  return (
    <>
      <button onClick={fetchSounds}>fetch</button>

      {soundList.length > 0 ? (
        soundList.map((sound, i) => (
          <div key={i}>
            <audio controls src={sound.previews["preview-lq-mp3"]}></audio>
          </div>
        ))
      ) : (
        <div>No boards found.</div>
      )}
    </>
  );
}

export default SimilarSounds;
