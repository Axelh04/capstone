import { useEffect, useContext } from "react";
import { UserContext } from "../UserContext.js";
import { Link } from "react-router-dom";
import StoringAudio from "./RecordingComp.jsx";
import LiveStreaming from "./LiveStreamingComp.jsx";

function RecordingPage() {
  const { user, updateUser } = useContext(UserContext);

  useEffect(() => {

  }, []);

  const handleLogout = () => {
    updateUser(null);
  };


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

      <LiveStreaming />
      <StoringAudio />
    </div>
  );
}

export default RecordingPage;
