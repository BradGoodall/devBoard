import { useContext } from "react";
import { signInWithPopup, signOut } from "firebase/auth";
import { auth, provider } from "../FirebaseConfig";
import { UserContext } from "../UserContext";
import Button from "react-bootstrap/Button";

function SignIn() {
  const authUser = useContext(UserContext);

  function handleClick() {
    signInWithPopup(auth, provider).then((data) => {
      console.log(data.user.displayName + " signed in.");
    });
  }

  function handleSignOut() {
    signOut(auth);
    console.log("User signed out.");
  }

  return (
    <>
      {!authUser && <Button onClick={handleClick}>Sign in with Google</Button>}

      {authUser && (
        <>
          <Button onClick={handleSignOut}>Sign Out</Button>
        </>
      )}
    </>
  );
}

export default SignIn;
