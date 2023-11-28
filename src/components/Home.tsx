function Home() {
  return (
    <div className="bg-office bg-cover min-h-screen pt-20">
      <div className="opacity-90 bg-columnBackgroundColor mx-auto min-w-[800px] max-w-[80%] p-3 border-double border-4 font-rem rounded-lg">
        <h1 className="m-3 text-3xl text-center font-rem">
          Welcome to <span className="text-3xl font-mono underline decoration-sky-500 decoration-4">devBoard</span>
        </h1>

        <div className="justify-right">
          <h2 className="text-xl text-center">Your Collaborative Project Hub</h2>

          <p className="p-5 text-justify">
            devBoard is an project collaboration tool designed for efficient organization and management of project tasks, while effectively monitoring assigned team members. Currently, it offers a
            kanban-style board for organization and tracking of tasks. As the project evolves, devBoard is anticipated to incorporate additional features, such as an inspiration board for pinning
            ideas and concepts, as well as a messaging system for project members.
          </p>

          <div className="mx-auto bg-origin-content bg-demo w-2/3 h-[600px] bg-contain bg-no-repeat"></div>
        </div>
      </div>
    </div>
  );
}
export default Home;
