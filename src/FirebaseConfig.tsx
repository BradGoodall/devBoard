import { initializeApp } from "firebase/app";
//import { getAnalytics } from "firebase/analytics";
import { GoogleAuthProvider, getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBMz3M_vrYphBnmEHFg3eyk9s1CsFuYCVg",
  authDomain: "devboard-5f556.firebaseapp.com",
  projectId: "devboard-5f556",
  storageBucket: "devboard-5f556.appspot.com",
  messagingSenderId: "25377415687",
  appId: "1:25377415687:web:facc7317ef564639df00a2",
  measurementId: "G-7TSWY2SB4G",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
export { auth, provider };
