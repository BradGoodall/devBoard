import { useMemo, useState, useEffect } from "react";
import { Lane, Id, Job, BoardData } from "../types";
import PlusIcon from "../assets/icons/PlusIcon";
import JobLane from "./JobLane";
import { DndContext, DragCancelEvent, DragEndEvent, DragOverEvent, DragOverlay, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, arrayMove } from "@dnd-kit/sortable";
import { createPortal } from "react-dom";
import { Spinner } from "react-bootstrap";
import { Timestamp, collection, doc, getDoc, getDocs, addDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "../FirebaseConfig";
import { User } from "firebase/auth";
import JobCard from "./JobCard";
import SyncIcon from "../assets/icons/SyncIcon";

interface Props {
  authUser: User | undefined;
}

function Board({ authUser }: Props) {
  const [lanes, setLanes] = useState<Lane[]>([]);
  const lanesId = useMemo(() => lanes.map((lane) => lane.laneID), [lanes]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [activeLane, setActiveLane] = useState<Lane | null>(null);
  const [activeJob, setActiveJob] = useState<Job | null>(null);
  const [editTitleMode, setEditTitleMode] = useState(false);
  const [boardTitle, setBoardTitle] = useState("My Board");
  const [isBoardFetched, setIsBoardFetched] = useState(false);
  const [boardData, setBoardData] = useState<BoardData | undefined>(undefined);
  const [unsavedChanges, setUnsavedChanges] = useState(false);

  // Retrieve the Board Data upon load.
  useEffect(() => {
    const fetchBoard = async () => {
      const boardDocRef = doc(db, "boards/" + "w9xEaBKo4db1ZkwADsNX");
      await getDoc(boardDocRef).then((boardDocument) => {
        const fetchedBoardData = boardDocument.data() as BoardData;
        setBoardData(fetchedBoardData);
        setBoardTitle(fetchedBoardData.boardTitle);
        console.log("Board Data Loaded");
      });
      await fetchLanes();
    };

    // If the board hasn't been fetched yet, fetch it.
    if (!isBoardFetched) {
      fetchBoard();
    }
  }, []);

  // Sensored used for dragging.
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 3, // Mouse must move 3px before dragging starts.
      },
    })
  );

  return (
    <>
      {/* If the board hasn't been fetched yet, show a loading spinner. */}
      {!isBoardFetched && (
        <div className="m-auto flex justify-center items-center h-screen">
          <Spinner animation="border" role="status" />
        </div>
      )}
      {/* Otherwise, show the board. */}
      {isBoardFetched && (
        <div style={{ backgroundImage: `url(${boardData?.backgroundURL})` }} className="m-auto min-h-screen overflow-x-auto overflow-y-hidden px-[40px] py-[80px] bg-cover">
          <div className="flex">
            {/* Board Title Section */}
            {!editTitleMode && (
              <div onClick={() => setEditTitleMode(true)} className="opacity-95 text-2xl font-bold py-[20px] px-[20px] my-[10px] bg-mainBackgroundColor rounded-md max-w-max">
                {boardTitle}
              </div>
            )}
            {editTitleMode && (
              <div>
                <input
                  className="text-2xl font-bold py-[20px] px-[20px] my-[10px] rounded-md bg-black focus:border-rose-500 border rounded outline-none max-w-max"
                  value={boardTitle}
                  onChange={(e) => setBoardTitle(e.target.value)}
                  autoFocus
                  onBlur={() => updateBoardTitle()}
                  onKeyDown={(e) => {
                    if (e.key !== "Enter") return;
                    updateBoardTitle();
                  }}
                ></input>
              </div>
            )}
            {unsavedChanges && (
              <button
                className="flex gap-2 items-center text-sm font-bold py-[10px] px-[10px] my-[10px] bg-mainBackgroundColor rounded-md max-w-max hover:stroke-rose-500 hover:bg-columnBackgroundColor"
                onClick={saveData}
              >
                <SyncIcon /> Save Changes
              </button>
            )}
          </div>

          {/* Board Lanes Section */}
          <DndContext sensors={sensors} onDragStart={onDragStart} onDragEnd={onDragEnd} onDragOver={onDragOver}>
            <div className="m-auto flex gap-4">
              <div className="flex gap-4">
                <SortableContext items={lanesId}>
                  {lanes.map((lane) => (
                    <JobLane
                      key={lane.laneID}
                      lane={lane}
                      deleteLane={deleteLane}
                      updateLane={updateLane}
                      createJob={createJob}
                      jobs={jobs.filter((job) => job.laneID === lane.laneID)}
                      deleteJob={deleteJob}
                      updateJob={updateJob}
                    />
                  ))}
                </SortableContext>
              </div>
              <button
                onClick={() => {
                  addLane();
                }}
                className="h-[60px] w-[350px] min-w-[350px] cursor-pointer rounded-lg bg-mainBackgroundColor border-2 border-columnBackgroundColor p-3 ring-rose-500 hover:ring-2 flex gap-2"
              >
                <PlusIcon /> Add Lane
              </button>
            </div>

            {createPortal(
              <DragOverlay>
                {activeLane && (
                  <JobLane
                    lane={activeLane}
                    deleteLane={deleteLane}
                    updateLane={updateLane}
                    createJob={createJob}
                    jobs={jobs.filter((job) => job.laneID === activeLane.laneID)}
                    deleteJob={deleteJob}
                    updateJob={updateJob}
                  />
                )}
                {activeJob && <JobCard job={activeJob} deleteJob={deleteJob} updateJob={updateJob} index={0} />}
              </DragOverlay>,
              document.body
            )}
          </DndContext>
        </div>
      )}
    </>
  );

  function addLane() {
    // Creates a new Lane
    const laneToAdd: Lane = {
      laneID: generateId(),
      laneTitle: `Lane ${lanes.length + 1}`,
      lanePosition: lanes.length + 1,
    };

    setLanes([...lanes, laneToAdd]);
  }

  function generateId() {
    // Generate a random ID
    return Math.floor(Math.random() * 10001).toString();
  }

  function deleteLane(id: Id) {
    const filteredLanes = lanes.filter((lane) => lane.laneID !== id);
    setLanes(filteredLanes);

    const newJobs = jobs.filter((job) => job.laneID !== id);
    setJobs(newJobs);
  }

  function updateLane(id: Id, title: string) {
    const newLanes = lanes.map((lane) => {
      if (lane.laneID !== id) return lane;
      return { ...lane, title };
    });

    setLanes(newLanes);
  }

  // Create a New Job Card.
  async function createJob(laneID: string) {
    // First we'll create the default job variables.
    const newJob: Job = {
      description: "Description",
      laneID: laneID,
      timeCreated: Timestamp.now(),
      jobTitle: "New Job",
      userID: authUser?.uid,
      jobID: "TempID",
      jobIndex: jobs.length,
    };

    // Then we instantly add the job to the lane to avoid a delay when writing to the db.
    setJobs((prevJobs) => [...prevJobs, newJob]);

    // Next we'll add the newly created job card to the db
    try {
      const jobsDocRef = collection(db, "boards/" + "w9xEaBKo4db1ZkwADsNX" + "/jobs/");
      const docRef = await addDoc(jobsDocRef, newJob);

      // Update the jobID on the docID
      await updateDoc(docRef, { jobID: docRef.id }).then(() => {
        // Now we'll update the local job card's jobID with the one created in the db
        setJobs((prevJobs) => [
          ...prevJobs.filter((job) => job.jobID !== "TempID"),
          {
            ...newJob,
            jobID: docRef.id,
          },
        ]);
        console.log("New Job created with ID: ", docRef.id);
      });
    } catch (e) {
      console.error("Error adding job: ", e);
    }
  }

  async function deleteJob(jobID: Id) {
    try {
      const jobsDocRef = doc(db, "boards/" + "w9xEaBKo4db1ZkwADsNX" + "/jobs/" + jobID);
      await deleteDoc(jobsDocRef).then(() => {
        console.log(jobs.find((job) => job.jobID === jobID)?.jobTitle + " has been Deleted!");
      }); // Delete the Job from the db
    } catch (e) {
      console.error("Error deleting job: ", e);
    }
    const newJobs = jobs.filter((job) => job.jobID !== jobID);
    setJobs(newJobs);
  }

  async function fetchLanes() {
    // Get the lanes
    const lanesDocRef = collection(db, "boards/" + "w9xEaBKo4db1ZkwADsNX" + "/lanes/");
    const lanesData = await getDocs(lanesDocRef);
    // Sort the lanes by lanePosition
    const sortedLanes = lanesData.docs.map((doc) => ({ ...doc.data() } as Lane)).sort((a, b) => a.lanePosition - b.lanePosition);
    setLanes(sortedLanes);
    // Get the jobs
    const jobsDocRef = collection(db, "boards/" + "w9xEaBKo4db1ZkwADsNX" + "/jobs/");
    const jobsData = await getDocs(jobsDocRef);
    const fetchedJobs = jobsData.docs.map((doc) => ({ ...doc.data() } as Job));
    setJobs(fetchedJobs.sort((a, b) => a.jobIndex - b.jobIndex)); // Sort the jobs by Index
    console.log("Board Lanes Loaded");
    setIsBoardFetched(true);
  }

  function onDragStart(event: DragCancelEvent) {
    if (event.active.data.current?.type === "Lane") {
      setActiveLane(event.active.data.current.lane);
      return;
    }

    if (event.active.data.current?.type === "Job") {
      setActiveJob(event.active.data.current.task);
      return;
    }
  }

  // Drag End
  function onDragEnd(event: DragEndEvent) {
    setUnsavedChanges(true);
    setActiveLane(null);
    setActiveJob(null);

    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveALane = active.data.current?.type === "Lane";
    if (!isActiveALane) return;

    setLanes((lanes) => {
      const activeLaneIndex = lanes.findIndex((lane) => lane.laneID === activeId);
      const overLaneIndex = lanes.findIndex((lane) => lane.laneID === overId);
      return arrayMove(lanes, activeLaneIndex, overLaneIndex);
    });
  }

  // Drag Over
  function onDragOver(event: DragOverEvent) {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveAJob = active.data.current?.type === "Job";
    const isOverAJob = over.data.current?.type === "Job";

    if (!isActiveAJob) return;

    // Dropping Job over another Job
    if (isActiveAJob && isOverAJob) {
      setJobs((jobs) => {
        const activeIndex = jobs.findIndex((job) => job.jobID === activeId);
        const overIndex = jobs.findIndex((job) => job.jobID === overId);

        if (jobs[activeIndex].laneID != jobs[overIndex].laneID) {
          jobs[activeIndex].laneID = jobs[overIndex].laneID;
          return arrayMove(jobs, activeIndex, overIndex - 1);
        }
        return arrayMove(jobs, activeIndex, overIndex);
      });
    }

    // Dropping Job over another Lane
    const isOverALane = over.data.current?.type === "Lane";

    if (isActiveAJob && isOverALane) {
      setJobs((jobs) => {
        const activeIndex = jobs.findIndex((t) => t.jobID === activeId);
        console.log("Moving " + jobs[activeIndex].jobTitle + " from " + jobs[activeIndex].laneID + " to " + overId.toString());
        jobs[activeIndex].laneID = overId.toString();
        return arrayMove(jobs, activeIndex, activeIndex);
      });
    }
  }

  function updateJob(jobID: Id, jobTitle: string) {
    const newJobs = jobs.map((job) => {
      if (job.jobID !== jobID) return job;
      return { ...job, jobTitle };
    });
    setJobs(newJobs);
    setUnsavedChanges(true);
  }

  async function saveData() {
    await updateLanePositions();
    await updateJobData();
    await updateBoardTitle().then(() => setUnsavedChanges(false));
  }

  async function updateLanePositions() {
    // Update the lane positions on the db.
    lanes.map((laneToUpdate) => {
      const newLanePosition = lanes.findIndex((lane) => lane.laneID === laneToUpdate.laneID);
      const laneDocRef = doc(db, "boards/" + "w9xEaBKo4db1ZkwADsNX" + "/lanes/" + laneToUpdate.laneID);
      updateDoc(laneDocRef, {
        lanePosition: newLanePosition,
      });
      console.log("Updated " + laneToUpdate.laneTitle + " postion to " + newLanePosition);
    });
  }

  async function updateJobData() {
    // Update the job data on the db.
    jobs.map((jobToUpdate) => {
      const jobDocRef = doc(db, "boards/" + "w9xEaBKo4db1ZkwADsNX" + "/jobs/" + jobToUpdate.jobID);
      updateDoc(jobDocRef, {
        laneID: jobToUpdate.laneID,
        jobTitle: jobToUpdate.jobTitle,
        jobIndex: jobToUpdate.jobIndex,
      });
      console.log("Updated " + jobToUpdate.jobTitle + " data");
    });
  }

  async function updateBoardTitle() {
    // Update the board title on the db.
    const boardDocRef = doc(db, "boards/" + "w9xEaBKo4db1ZkwADsNX");
    updateDoc(boardDocRef, {
      boardTitle: boardTitle,
    });
    console.log("Updated Board Title to " + boardTitle);
    setEditTitleMode(false);
  }
}

export default Board;
