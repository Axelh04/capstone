/* eslint-disable react/prop-types */

import { useContext, useEffect, useState } from "react";
import { UserContext } from "../UserContext.js";

function SavedRecordings({ recordings, setRecordings }) {
  const { user } = useContext(UserContext);
  const [recordingIDs, setRecordingIDs] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

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
        const urls = data.map((item) => {
          const audioBlob = convertToBlob(item.audios.data, "audio/mp3");
          return URL.createObjectURL(audioBlob);
        });
        const ids = data.map((item) => {
          const numID = item.id;
          return numID;
        });
        setRecordings(urls);
        setRecordingIDs(ids);
      }
    } catch (error) {
      console.error("Failed to fetch: ", error);
      alert("Failed to fetch audios. Please try again.", error.message);
    }
  };

  const handleDelete = async (index) => {
    try {
      const audioID = recordingIDs[index];
      const audioURL = recordings[index];
      const response = await fetch(
        `http://localhost:3000/users/${user.id}/audios/${audioID}/delete`,
        { method: "DELETE" }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      } else {
        const updatedIDs = recordingIDs.filter(function (ID) {
          return ID !== audioID;
        });

        const updatedURLs = recordings.filter(function (url) {
          return url !== audioURL;
        });

        setRecordingIDs(updatedIDs);
        setRecordings(updatedURLs);
      }
    } catch (error) {
      console.error("Failed to delete audio:", error);
      alert("Failed to delete audio. Please try again.", error.message);
    }
  };

  return (
    <div id="profile-recordings-list">
      {recordings.length > 0 ? (
        recordings.map((url, index) => (
          <>
            <audio className="profile-audio" key={index} controls src={url} />
            <span
              className="trash-icon"
              onClick={() => {
                handleDelete(index);
              }}
            >
              🗑️
            </span>
          </>
        ))
      ) : (
        <div>No Recordings found.</div>
      )}
    </div>
  );
}

export default SavedRecordings;
