import { useContext } from "react";
import { UserContext } from "../UserContext.js";
import { useState } from "react";
import { Link } from "react-router-dom";
import NavBar from "../NavBarComp/NavBar.jsx";
import RecordingComp from "./RecordingComp.jsx";
import SimilarSounds from "./SimilarSounds.jsx";
import "./RecordingPage.css";

function RecordingPage() {
  const { user } = useContext(UserContext);
  const [note, setNote] = useState(0);
  const [playbackDuration, setPlaybackDuration] = useState(0);

  return (
    <div className="main">
      <NavBar />
      <div className="user-info">
        {user ? (
          <>
            <span> {user.username}!</span>
          </>
        ) : (
          <Link to="/">Error: Please go Back</Link>
        )}
      </div>

      <div className="recording-container">
        <RecordingComp
          note={note}
          setNote={setNote}
          setPlaybackDuration={setPlaybackDuration}
          playbackDuration={playbackDuration}
        />
      </div>
      <div className="instruments-container"></div>

      <div className="playback-container">
        <div className="similar-sounds-container">
          <SimilarSounds note={note} playbackDuration={playbackDuration} />
        </div>
      </div>
    </div>
  );
}

export default RecordingPage;
