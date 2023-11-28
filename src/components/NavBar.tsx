import { useContext } from "react";
import { UserContext } from "../UserContext";
import SignIn from "./SignIn";
import { FaHashtag } from "react-icons/fa";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";

function NavBar() {
  const authUser = useContext(UserContext);

  return (
    <Navbar fixed="top" className="bg-columnBackgroundColor">
      <Container>
        <Navbar.Brand className="inline-flex m-2 text-2xl text-white font-mono" href="#home">
          <FaHashtag className="mt-1" />
          devBoard
        </Navbar.Brand>
        <Navbar.Collapse className="justify-content-end">
          {authUser && (
            <Navbar.Text className="mr-2 text-white">
              Signed in as: <a href="#login">{authUser?.displayName}</a>
            </Navbar.Text>
          )}
        </Navbar.Collapse>
        <SignIn />
      </Container>
    </Navbar>
  );
}

export default NavBar;
