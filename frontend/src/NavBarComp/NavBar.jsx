import { Link } from "react-router-dom";
import "./NavBar.css";

function NavBar() {
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

      <span id="arrow">→</span>
    </div>
  );
}

export default NavBar;
