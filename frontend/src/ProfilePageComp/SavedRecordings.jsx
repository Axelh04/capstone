import { useContext, useEffect, useState } from "react";
import { UserContext } from "../UserContext.js";

function SavedRecordings() {
  const { user } = useContext(UserContext);
  const [recordings, setRecordings] = useState([]);

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
          const audioBlob = convertToBlob(item.audios.data, "audio/mp4"); //converts each value in data.audios.data into a blob
          return URL.createObjectURL(audioBlob); //creates URL from blob
        });
        setRecordings(urls);//Updates state variable with recent list of recordings
      }
    } catch (error) {
      alert("Failed to fetch audios. Please try again.");
    }
  };

  return (
    <div>
      <div>
        {recordings.length > 0 ? (
          recordings.map((url, index) => (
            <audio key={index} controls src={url} />
          ))
        ) : (
          <div>No Recordings found.</div>
        )}
      </div>
    </div>
  );
}

export default SavedRecordings;
