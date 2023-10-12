import { useContext } from "react";
import { UserContext } from "../UserContext";

function Profile() {
  const authUser = useContext(UserContext);

  return (
    <>
      <h1>Profile</h1>
      {authUser && <h2>Hello, {authUser.displayName}!</h2>}
    </>
  );
}
export default Profile;
