/* eslint-disable react/prop-types */
import { useState } from "react";
import "./InstrumentSelection.css";

function InstrumentSelection({
  midiSounds,
  setSelectedInstrument,
  setIsLoadingInstrument,
}) {
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
    if (index === selectedIdx) setSelectedIdx(null);
    else setSelectedIdx(index);

    setSelectedInstrument(index);
    setIsLoadingInstrument(true);

    setTimeout(() => {
      setIsLoadingInstrument(false);
    }, 1000);
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
