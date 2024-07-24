/* eslint-disable react/prop-types */
import { useState } from "react";
import "./InstrumentSelection.css";

function InstrumentSelection({ midiSounds, setSelectedInstrument }) {
  const [selectedIdx, setSelectedIdx] = useState(null);
  let instrumentList = [];
  for (
    let i = 0;
    i < midiSounds.current.player.loader.instrumentKeys().length;
    i++
  ) {
    instrumentList.push(midiSounds.current.player.loader.instrumentInfo(i));
  }

  const handleSelectInstrument = (index) => {
    setSelectedIdx(index); // Set the selected index
    setSelectedInstrument(index); // Perform any additional actions
  };

  return (
    <>
      <div id="instrument-list">
        {instrumentList.length > 0 ? (
          instrumentList.map((instrument, index) => (
            <div
              key={index}
              className={`instrument-item ${
                selectedIdx === index ? "selected" : ""
              }`}
              onClick={() => handleSelectInstrument(index)}
            >
              {index + 1}. {instrument.title}{" "}
            </div>
          ))
        ) : (
          <div>No Recordings found.</div>
        )}
      </div>
    </>
  );
}

export default InstrumentSelection;
