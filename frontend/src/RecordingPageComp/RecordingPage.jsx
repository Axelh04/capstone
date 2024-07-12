import { useContext } from "react";
import { UserContext } from "../UserContext.js";
import { useState } from "react";
import { Link } from "react-router-dom";
import NavBar from "../NavBarComp/NavBar.jsx";
import RecordingComp from "./RecordingComp.jsx";
import SimilarSounds from "./SimilarSounds.jsx";

function RecordingPage() {
  const { user } = useContext(UserContext);
  const [note, setNote] = useState(0);
  const [playbackDuration, setPlaybackDuration] = useState(0);

  return (
    <div className="main">
      <header className="header">
        <div className="user-info">
          {user ? (
            <>
              <span>Hi {user.username}! |</span>
            </>
          ) : (
            <Link to="/">Error: Please go Back</Link>
          )}
        </div>
      </header>

      <RecordingComp
        note={note}
        setNote={setNote}
        setPlaybackDuration={setPlaybackDuration}
        playbackDuration={playbackDuration}
      />
      <SimilarSounds note={note} playbackDuration={playbackDuration} />
      <NavBar />
    </div>
  );
}

export default RecordingPage;
