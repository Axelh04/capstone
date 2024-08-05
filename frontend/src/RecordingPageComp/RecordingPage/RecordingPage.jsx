import { useState, useRef, useEffect } from "react";
import MIDISounds from "midi-sounds-react";
import NavBar from "../../NavBarComp/NavBar.jsx";
import SimilarSounds from "../SimilarSounds/SimilarSounds.jsx";
import PlaybackContainer from "../PlaybackContainer/PlaybackContainerComp.jsx";
import InstrumentSelection from "../InstrumentSelection/InstrumentSelectionComp.jsx";
import RecordingSelector from "../RecordingSelection/RecordingSelectionComp.jsx";
import RecordingComp from "../RecordingComp/RecordingComp.jsx";
import "./RecordingPage.css";

function RecordingPage() {
  const [note, setNote] = useState(0);
  const [playbackDuration, setPlaybackDuration] = useState(0);
  const [selectedInstrument, setSelectedInstrument] = useState("");
  const [selectedBlob, setSelectedBlob] = useState(null);
  const [isLoadingInstrument, setIsLoadingInstrument] = useState(false);
  const [isLoadingRecording, setIsLoadingRecording] = useState(false);
  const [refreshNum, setRefreshNum] = useState(0);

  const midiSounds = useRef(null);

  const [isMidiReady, setIsMidiReady] = useState(false);
  useEffect(() => {
    const checkMidiInitialization = () => {
      if (midiSounds.current && midiSounds.current.player) {
        setIsMidiReady(true);
      }
    };
    setTimeout(checkMidiInitialization, 50);
  }, [selectedBlob]);

  return (
    <>
      <div className="main">
        <NavBar />
        <div id="top-half-container">
          <RecordingComp
            refreshNum={refreshNum}
            setRefreshNum={setRefreshNum}
          />
          <RecordingSelector
            setSelectedBlob={setSelectedBlob}
            selectedBlob={selectedBlob}
            setIsLoadingRecording={setIsLoadingRecording}
            refreshNum={refreshNum}
          />

          <div id="instruments-label">Select an Instrument</div>
          <div className="instruments-container">
            {isMidiReady && (
              <InstrumentSelection
                midiSounds={midiSounds}
                setSelectedInstrument={setSelectedInstrument}
                setIsLoadingInstrument={setIsLoadingInstrument}
              />
            )}
          </div>
        </div>
        <div id="bottom-half-container">
          <div id="playback-label">Play Your Sounds</div>
          <div id="playback-container">
            {isLoadingRecording ? (
              <div className="playback-container-spinner-container">
                <div className="playback-container-spinner"></div>
              </div>
            ) : (
              <div>
                {isMidiReady &&
                  (isLoadingInstrument ? (
                    <div className="spinner-container">
                      <div className="playbutton-spinner"></div>
                    </div>
                  ) : (
                    <div>
                      <PlaybackContainer
                        midiSounds={midiSounds}
                        selectedInstrument={selectedInstrument}
                        selectedBlob={selectedBlob}
                        setNote={setNote}
                        setPlaybackDuration={setPlaybackDuration}
                      />
                    </div>
                  ))}
                <div className="similar-sounds-container">
                  <SimilarSounds
                    note={note}
                    playbackDuration={playbackDuration}
                  />
                </div>
              </div>
            )}
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

        <div id="footer-text">By Axelh04 | Meta University 2024</div>
      </footer>
    </>
  );
}

export default RecordingPage;
