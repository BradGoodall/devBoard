import { useState, useEffect } from "react";
import { auth } from "./FirebaseConfig";
import { User, onAuthStateChanged } from "firebase/auth";
import { UserContext } from "./UserContext";
import SignIn from "./components/SignIn";
import "./App.css";
import NavBar from "./components/NavBar";

function App() {
  // This holds the current user object
  const [authUser, setAuthUser] = useState<User | undefined>(undefined);

  useEffect(() => {
    // If the AuthState changed, update the current user object
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setAuthUser(user);
      } else {
        setAuthUser(undefined);
      }
    });
  }, []);

  return (
    <>
      <UserContext.Provider value={authUser}>
        <NavBar />
        {authUser && <h1>Hello, {authUser.displayName}</h1>}
        <SignIn />
      </UserContext.Provider>
    </>
  );
}

export default App;
