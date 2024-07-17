/* eslint-disable react/prop-types */

// import { useEffect, useState } from "react";

function InstrumentSelection({ midiSounds, setSelectedInstrument }) {

    let instrumentList = [];
    for (
      let i = 0;
      i < midiSounds.current.player.loader.instrumentKeys().length;
      i++
    ) {
      instrumentList.push(midiSounds.current.player.loader.instrumentInfo(i));
    }

  

  return (
    <>
      {instrumentList.length > 0 ? (
        instrumentList.map((instrument, index) => (
          <div key={index} onClick={() => setSelectedInstrument(index)}> {instrument.title} </div>
        ))
      ) : (
        <div>No Recordings found.</div>
      )}
    </>
  );
}

export default InstrumentSelection;
