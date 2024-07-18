/* eslint-disable react/prop-types */

import { useContext, useEffect, useState } from "react";
import { UserContext } from "../UserContext.js";

function RecordingSelector({ setSelectedBlob, selectedBlob }) {
  const { user } = useContext(UserContext);
  const [recordings, setRecordings] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const container = document.querySelector(".recording-container");
    container.addEventListener("scroll", handleScroll);
    return () => {
      container.removeEventListener("scroll", handleScroll);
    };
  }, [selectedBlob]);

  function handleScroll(event) {
    const elements = document.querySelectorAll(".audio-item");
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
      <div className="recording-container">
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
    </>
  );
}

export default RecordingSelector;
