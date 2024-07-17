/* eslint-disable react/prop-types */
function PlaybackContainer({
  midiSounds,
  note,
  playbackDuration,
  selectedInstrument,
}) {
  const playTestInstrument = () => {
    midiSounds.current.playChordNow(
      selectedInstrument,
      [note],
      playbackDuration
    );
  };



  return (
    <div id="instrument-sound-container">
      <button onClick={playTestInstrument}>Play</button>
      {selectedInstrument !== "" ? (
        <div>
          Selected:
          {midiSounds.current.player.loader.instrumentInfo(selectedInstrument)
              .title}
        </div>
      ) : (
        <div> No Instrument Selected.</div>
      )}
    </div>
  );
}

export default PlaybackContainer;
