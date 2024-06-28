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
    
      </div>
    )
}

export default Temp;