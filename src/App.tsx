import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { useState, useEffect } from "react";
import { auth } from "./FirebaseConfig";
import { User, onAuthStateChanged } from "firebase/auth";
import { UserContext } from "./UserContext";
import NavBar from "./components/NavBar";
import Home from "./components/Home";
import Board from "./components/Board";

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
        {!loaded && <h1>Loading...</h1>}
        {loaded && (
          <>
            {!authUser && <Home />}
            {authUser && <Board />}
          </>
        )}
      </UserContext.Provider>
    </>
  );
}

export default App;
