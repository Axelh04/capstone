/* eslint-disable react/prop-types */

import { useContext, useEffect, useState, useRef } from "react";
import { UserContext } from "../UserContext.js";
import "./RecordingWheel.css";

function RecordingSelector({ setSelectedBlob, selectedBlob }) {
  const { user } = useContext(UserContext);
  const [recordings, setRecordings] = useState([]);
  const containerRef = useRef(null); // Ref for the container

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    container.addEventListener("scroll", handleScroll);
    return () => {
      container.removeEventListener("scroll", handleScroll);
    };
  }, [selectedBlob]);

  function handleScroll(event) {
    if (!containerRef.current) return;
    const elements = containerRef.current.querySelectorAll(".audio-item");
    const containerHeight = event.target.offsetHeight;
    const containerScrollTop = event.target.scrollTop;
    let closestElem = null;
    let minDistance = null;
    elements.forEach((elem) => {
      const elemTop = elem.offsetTop - containerScrollTop;
      const elemMiddle = elemTop + elem.offsetHeight / 2;
      const distance = Math.abs(elemMiddle - containerHeight / 2);
      if (minDistance === null || distance < minDistance) {
        closestElem = elem;
        minDistance = distance;
      }

      const maxDistance = containerHeight / 2; // maximum possible distance from the center
      const scale = 1 - distance / maxDistance; // Calculate scale based on proximity
      const minScale = 0.7; // Minimum scale factor
      const maxScale = 1.3; // Maximum scale factor
      const normalizedScale = minScale + (maxScale - minScale) * scale; // Normalize scale between minScale and maxScale
      elem.style.transform = `scale(${normalizedScale})`; // Apply scale transformation
    });
    if (closestElem) {
      const index = Array.from(elements).indexOf(closestElem);
      setSelectedBlob(recordings[index]);
    }
  }

  function convertToBlob(byteArray, mimeType) {
    const arrayBuffer = new Uint8Array(byteArray).buffer;
    return new Blob([arrayBuffer], { type: mimeType });
  }
  const fetchData = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/users/${user.id}/audios`,
        { method: "GET" }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      } else {
        const data = await response.json();
        const blobs = data.map((item) => {
          const audioBlob = convertToBlob(item.audios.data, "audio/mp4"); //converts each value in data.audios.data into a blob
          return audioBlob;
        });
        setRecordings(blobs); //Updates state variable with recent list of recordings
      }
    } catch (error) {
      alert("Failed to fetch audios. Please try again.");
    }
  };

  return (
    <>
      <div id="audio-selection-outline"></div>
      <div className="recording-container" ref={containerRef}>
        <div id="wheel-top-shadow-box"></div>
        {recordings.length > 0 ? (
          recordings.map((blob, index) => (
            <div key={index} className="audio-item">
              <audio controls src={URL.createObjectURL(blob)} />
            </div>
          ))
        ) : (
          <div>No Recordings found.</div>
        )}
        xs
      </div>
      <div id="wheel-bottom-shadow-box"></div>
    </>
  );
}

export default RecordingSelector;
