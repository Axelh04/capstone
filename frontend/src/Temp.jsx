import { useEffect, useContext } from "react";
import { UserContext } from "./UserContext.js";
import { Link } from "react-router-dom";

function Temp() {
    const { user, updateUser } = useContext(UserContext);

  
    useEffect(() => {
  
    }, []);
  

    const handleLogout = () => {
      // Perform logout logic here
      // Example: Clear user data from localStorage, reset user state, etc.
      updateUser(null);
    };

    async function startRecording() {
      try {
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          const audioContext = new AudioContext();
          const source = audioContext.createMediaStreamSource(stream);
          source.connect(audioContext.destination); // Connect to speaker to hear the audio
  
          // Now the audio is being captured and routed through the Web Audio API
      } catch (error) {
          console.error('Error accessing microphone', error);
      }
  }
  
    return (
      <div className="main">
      <header className="header">
        <div className="user-info">
          {user ? (
            <>
              <span>Hi {user.username}! |</span>
              <Link to="/">
              <button onClick={handleLogout}>Logout</button>
              </Link>
            </>
          ) : (
            <Link to="/">Back</Link>
          )}
        </div>
      </header>


      <div>

          <button onClick={startRecording}>Record</button>

        
      </div>
    
      </div>
    )
}

export default Temp;