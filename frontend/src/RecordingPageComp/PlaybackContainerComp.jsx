/* eslint-disable react/prop-types */
import { useRef } from "react";
import MIDISounds from "midi-sounds-react";


function PlaybackContainer({note, playbackDuration}) {

    const midiSounds = useRef(null);
    const playTestInstrument = () => {
      midiSounds.current.playChordNow(3, [note], playbackDuration);
    };

return (
    <div id = "instrument-sound-container">
         <button onClick={playTestInstrument}>Play</button>
          <MIDISounds ref={midiSounds} appElementName="root" instruments={[3]} />

    </div>
);

}

export default PlaybackContainer
