function LiveStreaming() {
  async function startRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const audioContext = new AudioContext();
      const source = audioContext.createMediaStreamSource(stream);
      source.connect(audioContext.destination);
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
