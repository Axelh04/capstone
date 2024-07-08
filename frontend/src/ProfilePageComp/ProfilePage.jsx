import { useContext } from "react";
import { UserContext } from "../UserContext.js";
import { Link } from "react-router-dom";
import SavedRecordings from "./SavedRecordings.jsx";
import NavBar from "../NavBarComp/NavBar.jsx";

function ProfilePage() {
  const { user, updateUser } = useContext(UserContext);

  const handleLogout = () => {
    updateUser(null);
  };

  return (
    <div className="main">
      <header className="header">
        <div className="user-info">
          {user ? (
            <>
              <div>This is your profile: {user.username}</div>
              <Link to="/">
                <button onClick={handleLogout}>Logout</button>
              </Link>
            </>
          ) : (
            <Link to="/">Back</Link>
          )}
        </div>
      </header>

      <SavedRecordings />
      <NavBar />
    </div>
  );
}

export default ProfilePage;
