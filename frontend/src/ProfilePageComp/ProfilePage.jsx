import { useContext, useState } from "react";
import { UserContext } from "../UserContext.js";
import { Link } from "react-router-dom";
import SavedRecordings from "./SavedRecordings.jsx";
import NavBar from "../NavBarComp/NavBar.jsx";
import "./ProfilePage.css";

function ProfilePage() {
  const { user, updateUser } = useContext(UserContext);
  const [recordings, setRecordings] = useState([]);

  const handleLogout = () => {
    updateUser(null);
  };

  return (
    <div className="main">
      <div id="profile-info-title">Profile Information</div>
      <div id="profile-info-container">
        {user ? (
          <div id="profile-details">
            <div className="info-text">
              Your UserID: <span className="user-detail">{user.id}</span>
            </div>
            <div className="info-text">
              Your Username:{" "}
              <span className="user-detail">{user.username}</span>
            </div>
            <div className="info-text">
              Your Email: <span className="user-detail">{user.email}</span>
            </div>
            <div className="info-text">
              Total Recordings:{" "}
              <span className="user-detail">{recordings.length}</span>{" "}
            </div>
            <Link to="/">
              <button id="logout-button" onClick={handleLogout}>
                Logout
              </button>
            </Link>
          </div>
        ) : (
          <Link to="/">Back</Link>
        )}
      </div>
      <div id="profile-recordings-title">All Recordings</div>
      <SavedRecordings recordings={recordings} setRecordings={setRecordings} />
      <NavBar />
    </div>
  );
}

export default ProfilePage;
