import { useContext } from "react";
import { UserContext } from "../UserContext";

function Home() {
  const authUser = useContext(UserContext);

  return (
    <>
      <div>
        <h1>Welcome to devBoard</h1>
        <h2>Your Collaborative Project Hub</h2>
        <p>
          devBoard is an ongoing project collaboration tool designed to
          facilitate efficient organization and management of project tasks,
          while effectively monitoring assigned team members. Presently, it
          offers a kanban-style board that enables seamless organization and
          tracking of tasks. As the project evolves, devBoard is anticipated to
          incorporate additional features, such as an inspiration board for
          pinning ideas and concepts, as well as a messaging system tailored for
          project members.
        </p>
      </div>
    </>
  );
}
export default Home;
