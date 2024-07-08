import { useContext } from "react";
import { UserContext } from "../UserContext.js";
import { Link } from "react-router-dom";
import NavBar from "../NavBarComp/NavBar.jsx";
import RecordingComp from "./RecordingComp.jsx";

function RecordingPage() {
  const { user } = useContext(UserContext);

  return (
    <div className="main">
      <header className="header">
        <div className="user-info">
          {user ? (
            <>
              <span>Hi {user.username}! |</span>
            </>
          ) : (
            <Link to="/">Error: Please go Back</Link>
          )}
        </div>
      </header>

      <RecordingComp />
      <NavBar />
    </div>
  );
}

export default RecordingPage;
