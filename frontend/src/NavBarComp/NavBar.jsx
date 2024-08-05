import { Link } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../UserContext";
import "./NavBar.css";

function NavBar() {
  const { user } = useContext(UserContext);

  return (
    <div className="navBar">
      <Link to="/profile">
        <h1 className="navButton">Profile</h1>
      </Link>
      <Link to="/record">
        <h1 className="navButton">Record</h1>
      </Link>
      <Link to="/">
        <h1 className="navButton">Landing</h1>
      </Link>

      <div className="user-info">
        {user ? (
          <>
            <span id="orange-text"> {user.username} </span> Session.
          </>
        ) : (
          <Link to="/">Error: Please go Back</Link>
        )}
      </div>

      <span id="arrow">↓</span>
      <div id="gray-box"></div>
    </div>
  );
}

export default NavBar;
