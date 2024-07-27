/* eslint-disable react/prop-types */

import { useContext, useEffect, useState, useRef } from "react";
import { UserContext } from "../UserContext.js";
import "./RecordingWheel.css";

function RecordingSelector({
  setSelectedBlob,
  selectedBlob,
  setIsLoadingRecording,
}) {
  const { user } = useContext(UserContext);
  const [recordings, setRecordings] = useState([]);
  const containerRef = useRef(null);

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
      //Selects of Audio Element based on proximity to center
      const elemTop = elem.offsetTop - containerScrollTop;
      const elemMiddle = elemTop + elem.offsetHeight / 2;
      const distance = Math.abs(elemMiddle - containerHeight / 2);
      if (minDistance === null || distance < minDistance) {
        closestElem = elem;
        minDistance = distance;
      }

      //Scales Audio Element based on proximity to center
      const maxDistance = containerHeight / 2;
      const scale = 1 - distance / maxDistance;
      const minScale = 0.7;
      const maxScale = 1.3;
      const normalizedScale = minScale + (maxScale - minScale) * scale;
      elem.style.transform = `scale(${normalizedScale})`;
    });
    if (closestElem) {
      const index = Array.from(elements).indexOf(closestElem);
      setIsLoadingRecording(true);
      setTimeout(() => {
        setIsLoadingRecording(false);
      }, 2000);
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
          const audioBlob = convertToBlob(item.audios.data, "audio/mp3");
          return audioBlob;
        });
        setRecordings(blobs);
      }
    } catch (error) {
      alert("Failed to fetch audios. Please try again.", error.message);
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
      </div>
      <div id="wheel-bottom-shadow-box"></div>
    </>
  );
}

export default RecordingSelector;
