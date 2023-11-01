import { useContext } from "react";
import { signInWithPopup, signOut } from "firebase/auth";
import { auth, provider, db } from "../FirebaseConfig";
import {
  collection,
  addDoc,
  Timestamp,
  doc,
  getDoc,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { UserContext } from "../UserContext";
import Button from "react-bootstrap/Button";

function SignIn() {
  const authUser = useContext(UserContext);

  const handleSignInWithGoogle = async () => {
    await signInWithPopup(auth, provider).then((data) => {
      console.log(data.user.displayName + " signed in.");
    });
    await updateUserData(auth.currentUser?.displayName?.toString(), "Google");
  };

  //Update the user database
  const updateUserData = async (
    userName: string | undefined,
    provider: string
  ) => {
    const userID = auth.currentUser?.uid.toString();
    const docRef = doc(db, "users/" + userID);
    const userDoc = await getDoc(docRef);
    // Create new user entry if thy're not in the Database
    if (!userDoc.exists()) {
      const timestamp = Timestamp.fromDate(new Date());
      // Generate them a new board
      const boardRef = await addDoc(collection(db, "boards"), {
        ownerID: auth.currentUser?.uid,
        boardName: userName!.split(" ")[0] + "'s Board",
        timeCreated: timestamp,
        backgroundURL: "/backgrounds/sabri-tuzcu-mountain.jpg",
      });
      // Create the lanes
      // Here we create the 3 default lanes and set their IDs. Surely there's a better way I can do this.
      const lane1 = await addDoc(
        collection(db, "boards/" + boardRef.id + "/lanes/"),
        {}
      );
      const lane2 = await addDoc(
        collection(db, "boards/" + boardRef.id + "/lanes/"),
        {}
      );
      const lane3 = await addDoc(
        collection(db, "boards/" + boardRef.id + "/lanes/"),
        {}
      );
      await setDoc(lane1, {
        laneTitle: "In-Progress",
        laneID: lane1.id,
        lanePosition: 1,
      });
      await setDoc(lane2, {
        laneTitle: "To-Do",
        laneID: lane2.id,
        lanePosition: 2,
      });
      await setDoc(lane3, {
        laneTitle: "Completed",
        laneID: lane3.id,
        lanePosition: 3,
      });
      // Create a default job with instructions
      await addDoc(collection(db, "boards/" + boardRef.id + "/jobs/"), {
        title: "My First Job",
        description:
          "Welcome to devBoard! To create new jobs, simply click the 'Create New Job' button located within one of the three lanes. Feel free to drag and drop jobs between lanes to conveniently update their status as needed.",
        timeCreated: timestamp,
        userID: auth.currentUser?.uid,
        boardID: boardRef.id,
        laneID: lane2.id,
      });

      console.log("#WRITE Created a New Board");
      await setDoc(docRef, {
        name: userName,
        email: auth.currentUser?.email,
        timeCreated: timestamp,
        lastLogin: timestamp,
        userID: auth.currentUser?.uid,
        boardID: boardRef.id,
        imageUrl:
          auth.currentUser?.photoURL != null
            ? auth.currentUser?.photoURL
            : "/default_profile_image.png",
        provider: provider,
      });
      console.log("#WRITE Created a New User Account");
      console.log("Account Created");
    } else {
      // Update existing data
      const timestamp = Timestamp.fromDate(new Date());
      await updateDoc(docRef, { lastLogin: timestamp });
      console.log("Account Already Exists, Logged In");
      console.log("#WRITE Updated User Login Timestamp");
    }
  };

  function handleSignOut() {
    signOut(auth);
    console.log("User signed out.");
  }

  return (
    <>
      {!authUser && (
        <Button onClick={handleSignInWithGoogle}>Sign in with Google</Button>
      )}

      {authUser && (
        <>
          <Button onClick={handleSignOut}>Sign Out</Button>
        </>
      )}
    </>
  );
}

export default SignIn;
