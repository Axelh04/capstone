/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import "./InstrumentSelection.css";

function InstrumentSelection({
  midiSounds,
  setSelectedInstrument,
  setIsLoadingInstrument,
}) {
  const [selectedIdx, setSelectedIdx] = useState(null);
  const [query, setQuery] = useState("");

  let instrumentList = [];
  for (
    let i = 0;
    i < midiSounds.current.player.loader.instrumentKeys().length;
    i++
  ) {
    instrumentList.push(midiSounds.current.player.loader.instrumentInfo(i));
  }

  const handleSelectInstrument = (index) => {
    if (index === selectedIdx) {
      setSelectedIdx(null);
    } else {
      setSelectedIdx(index);
      setSelectedInstrument(index);
      setIsLoadingInstrument(true);
    }
  };

  useEffect(() => {
    setTimeout(() => {
      setIsLoadingInstrument(false);
    }, 1000);
  }, [selectedIdx]);

  const handleChange = function (event) {
    setQuery(event.target.value);
  };

  return (
    <>
      <input
        id="instrument-search-bar"
        onChange={handleChange}
        placeholder="Search.."
      />
      <div id="instrument-list">
        {instrumentList.length > 0 ? (
          instrumentList.map((instrument, index) => {
            if (instrument.title.toLowerCase().includes(query.toLowerCase())) {
              return (
                <div
                  key={index}
                  className={`instrument-item ${
                    selectedIdx === index ? "selected" : ""
                  }`}
                  onClick={() => handleSelectInstrument(index)}
                >
                  {index + 1}. {instrument.title}{" "}
                </div>
              );
            }
          })
        ) : (
          <div>No Recordings found.</div>
        )}
      </div>
      <div id="instrument-shadow-box-bottom"></div>
    </>
  );
}

export default InstrumentSelection;
