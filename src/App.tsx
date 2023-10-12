import { useState, useEffect } from "react";
import { auth } from "./FirebaseConfig";
import { User, onAuthStateChanged } from "firebase/auth";
import { UserContext } from "./UserContext";
import "./App.css";
import NavBar from "./components/NavBar";
import Home from "./components/Home";
import { CircularProgress } from "@mui/material";
import Profile from "./components/Profile";

function App() {
  // This holds the current user object
  const [authUser, setAuthUser] = useState<User | undefined>(undefined);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // If the AuthState changed, update the current user object
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setAuthUser(user);
        setLoaded(true);
      } else {
        setAuthUser(undefined);
        setLoaded(true);
      }
    });
  }, []);

  return (
    <>
      <UserContext.Provider value={authUser}>
        <NavBar />
        {!loaded && <CircularProgress style={{ margin: "5rem" }} />}
        {loaded && (
          <>
            {!authUser && <Home />}
            {authUser && <Profile />}
          </>
        )}
      </UserContext.Provider>
    </>
  );
}

export default App;
