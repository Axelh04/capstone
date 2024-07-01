import { useState, useEffect } from "react";
import { UserContext } from "./UserContext";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./LandingPageComp/Landing";
import LoginForm from "./UserAuth/LoginForm/LoginForm";
import SignupForm from "./UserAuth/SignupForm/SignupForm";
import RecordingPage from "./RecordingPageComp/RecordingPage";

function App() {
  const [user, setUser] = useState(() => {
    // Retrieve the user data from storage or set it to null if not found
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const updateUser = (newUser) => {
    setUser(newUser);
  };

  useEffect(() => {
    // Save the user data to storage whenever the user state changes
    localStorage.setItem("user", JSON.stringify(user));
  }, [user]);

  return (
    <div className="app">
      <UserContext.Provider value={{ user, updateUser }}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/temp" element={<RecordingPage />} />
            <Route
              path="/login"
              element={user ? <RecordingPage /> : <LoginForm />}
            />
            <Route path="/signup" element={<SignupForm />} />
          </Routes>
        </BrowserRouter>
      </UserContext.Provider>
    </div>
  );
}

export default App;
