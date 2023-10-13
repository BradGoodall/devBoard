function Home() {
  return (
    <>
      <div className="m-5 p-3 border-double border-4 font-rem rounded-lg">
        <h1 className="m-3 text-3xl text-center font-rem">
          Welcome to{" "}
          <span className="text-3xl font-mono underline decoration-sky-500 decoration-4">
            devBoard
          </span>
        </h1>

        <div>
          <h2 className="text-xl text-center">
            Your Collaborative Project Hub
          </h2>

          <p className="p-5 text-justify">
            devBoard is an project collaboration tool designed for efficient
            organization and management of project tasks, while effectively
            monitoring assigned team members. Currently, it offers a
            kanban-style board for organization and tracking of tasks. As the
            project evolves, devBoard is anticipated to incorporate additional
            features, such as an inspiration board for pinning ideas and
            concepts, as well as a messaging system for project members.
          </p>
        </div>
      </div>
    </>
  );
}
export default Home;
