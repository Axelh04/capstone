import { useContext } from "react";
import { UserContext } from "../UserContext.js";
import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import MIDISounds from "midi-sounds-react";
import NavBar from "../NavBarComp/NavBar.jsx";
import RecordingComp from "./RecordingComp.jsx";
import SimilarSounds from "./SimilarSounds.jsx";
import PlaybackContainer from "./PlaybackContainerComp.jsx";
import InstrumentSelection from "./InstrumentSelectionComp.jsx";
import "./RecordingPage.css";

function RecordingPage() {
  const { user } = useContext(UserContext);
  const [note, setNote] = useState(0);
  const [playbackDuration, setPlaybackDuration] = useState(0);
  const [selectedInstrument, setSelectedInstrument] = useState("");
  const midiSounds = useRef(null);

  const [isMidiReady, setIsMidiReady] = useState(false);
  useEffect(() => {
    const checkMidiInitialization = () => {
      if (midiSounds.current && midiSounds.current.player) {
        setIsMidiReady(true);
      }
    };
    // You might need to set a timeout or use another method to ensure midiSounds is initialized
    setTimeout(checkMidiInitialization, 1000); // Check after 1 second
  }, []);

  return (
    <div className="main">
      <NavBar />
      <footer>
        <MIDISounds
          ref={midiSounds}
          className="MIDIsoundsLogo"
          appElementName="root"
          instruments={[3]}
        />
      </footer>
      <div className="user-info">
        {user ? (
          <>
            <span> {user.username} Session.</span>
          </>
        ) : (
          <Link to="/">Error: Please go Back</Link>
        )}
      </div>

      <div className="recording-container">
        <RecordingComp
          setNote={setNote}
          setPlaybackDuration={setPlaybackDuration}
        />
      </div>
      <div className="instruments-container">
        {isMidiReady && (
          <InstrumentSelection
            midiSounds={midiSounds}
            setSelectedInstrument={setSelectedInstrument}
          />
        )}
      </div>

      <div className="playback-container">
        {isMidiReady && (
          <PlaybackContainer
            midiSounds={midiSounds}
            note={note}
            playbackDuration={playbackDuration}
            selectedInstrument={selectedInstrument}
          />
        )}
        <div className="similar-sounds-container">
          <SimilarSounds note={note} playbackDuration={playbackDuration} />
        </div>
      </div>
    </div>
  );
}

export default RecordingPage;
