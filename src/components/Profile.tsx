import { useContext } from "react";
import { UserContext } from "../UserContext";
import Image from "react-bootstrap/Image";

function Profile() {
  const authUser = useContext(UserContext);

  return (
    <>
      <div className="m-5 p-3 border-double border-4 font-rem rounded-lg">
        <h1 className="m-3 text-3xl text-center font-rem">
          Hello, {authUser?.displayName}
        </h1>

        <div>
          <h2 className="text-xl">Account Details</h2>

          <p className="p-5">
            Name: {authUser?.displayName}
            <br />
            Email: {authUser?.email}
            <br />
            Phone: {authUser?.phoneNumber ? authUser?.phoneNumber : "N/A"}
          </p>
          <Image
            rounded
            src={authUser?.photoURL?.toString()}
            alt={authUser?.displayName?.toString()}
          />
        </div>
      </div>
    </>
  );
}
export default Profile;
