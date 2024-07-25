
import { useState, useRef, useEffect } from "react";
import MIDISounds from "midi-sounds-react";
import NavBar from "../NavBarComp/NavBar.jsx";
import SimilarSounds from "./SimilarSounds.jsx";
import PlaybackContainer from "./PlaybackContainerComp.jsx";
import InstrumentSelection from "./InstrumentSelectionComp.jsx";
import RecordingSelector from "./RecordingSelectionComp.jsx";
import RecordingComp from "./RecordingComp.jsx";
import "./RecordingPage.css";

function RecordingPage() {
  const [note, setNote] = useState(0);
  const [playbackDuration, setPlaybackDuration] = useState(0);
  const [selectedInstrument, setSelectedInstrument] = useState("");
  const [selectedBlob, setSelectedBlob] = useState(null);

  const midiSounds = useRef(null);

  const [isMidiReady, setIsMidiReady] = useState(false);
  useEffect(() => {
    const checkMidiInitialization = () => {
      if (midiSounds.current && midiSounds.current.player) {
        setIsMidiReady(true);
      }
    };
    setTimeout(checkMidiInitialization, 1000);
  }, [selectedBlob]);

  return (
    <>
      <div className="main">
        <NavBar />

        <div id="top-half-container">
          <RecordingComp
            setNote={setNote}
            setPlaybackDuration={setPlaybackDuration}
            selectedBlob={selectedBlob}
          />
          <RecordingSelector
            setNote={setNote}
            setPlaybackDuration={setPlaybackDuration}
            setSelectedBlob={setSelectedBlob}
            selectedBlob={selectedBlob}
          />

          <div className="instruments-container">
            {isMidiReady && (
              <InstrumentSelection
                midiSounds={midiSounds}
                setSelectedInstrument={setSelectedInstrument}
              />
            )}
          </div>
        </div>
        <div id="bottom-half-container">
          <div className="playback-container">
            {isMidiReady && (
              <PlaybackContainer
                midiSounds={midiSounds}
                note={note}
                playbackDuration={playbackDuration}
                selectedInstrument={selectedInstrument}
                selectedBlob={selectedBlob}
                setNote={setNote}
                setPlaybackDuration={setPlaybackDuration}
              />
            )}
            <div className="similar-sounds-container">
              <SimilarSounds note={note} playbackDuration={playbackDuration} />
            </div>
          </div>
        </div>
      </div>
      <footer>
        <MIDISounds
          ref={midiSounds}
          className="MIDIsoundsLogo"
          appElementName="root"
          instruments={[3]}
        />
      </footer>
    </>
  );
}

export default RecordingPage;
