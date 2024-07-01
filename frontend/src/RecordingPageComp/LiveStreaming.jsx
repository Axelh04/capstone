function LiveStreaming() {
  async function startRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const audioContext = new AudioContext();
      const source = audioContext.createMediaStreamSource(stream);
      source.connect(audioContext.destination); // Connect to speaker to hear the audio

      // Now the audio is being captured and routed through the Web Audio API
    } catch (error) {
      console.error("Error accessing microphone", error);
    }
  }

  return (
    <div>
      <button onClick={startRecording}>Record</button>
    </div>
  );
}

export default LiveStreaming;
