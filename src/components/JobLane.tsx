import { useMemo, useState } from "react";
import TrashIcon from "../assets/icons/TrashIcon";
import { Lane, Id, Job } from "../types";
import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import PlusIcon from "../assets/icons/PlusIcon";
import JobCard from "./JobCard";

interface Props {
  lane: Lane;
  deleteLane: (id: Id) => void;
  updateLane: (id: Id, title: string) => void;

  createJob: (laneID: string) => void;
  deleteJob: (jobID: Id) => void;
  updateJob: (jobID: Id, jobTitle: string) => void;
  jobs: Job[];
  position: number;
}

function JobLane(props: Props) {
  const { lane, deleteLane, updateLane, createJob, jobs, deleteJob, position, updateJob } = props;

  const [editMode, setEditMode] = useState(false);

  const jobsIDs = useMemo(() => {
    return jobs.map((job) => job.jobID);
  }, [jobs]);

  const { setNodeRef, attributes, listeners, transform, transition, isDragging } = useSortable({
    id: lane.laneID,
    data: {
      type: "Lane",
      lane,
    },
    disabled: editMode,
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  if (isDragging) {
    return <div ref={setNodeRef} style={style} className="bg-columnBackgroundColor w-[350px] h-[800px] max-h-[800px] rounded-md flex flex-col opacity-60 border-2 border-rose-500"></div>;
  }

  return (
    <div ref={setNodeRef} style={style} className="bg-columnBackgroundColor w-[350px] h-[800px] max-h-[800px] rounded-md flex flex-col">
      {/* Lane Title */}

      <div
        {...attributes}
        {...listeners}
        onClick={() => setEditMode(true)}
        className="bg-mainBackgroundColor text-md h-[60px] cursor-grab rounded-md rounded-b-none p-3 font-bold border-columnBackgroundColor border-4 flex items-center justify-between"
      >
        <div className="flex gap-2">
          <div className="flex justify-center items-center bg-columnBackgroundColor px-2 py-1 text-sm rounded-full">0</div>
          {!editMode && lane.laneTitle + " [" + position + "] [" + lane.lanePosition + "]"}
          {editMode && (
            <input
              className="bg-black focus:border-rose-500 border rounded outline-none px-2"
              value={lane.laneTitle}
              onChange={(e) => updateLane(lane.laneID, e.target.value)}
              autoFocus
              onBlur={() => setEditMode(false)}
              onKeyDown={(e) => {
                if (e.key !== "Enter") return;
                setEditMode(false);
              }}
            ></input>
          )}
        </div>
        <button
          onClick={() => {
            deleteLane(lane.laneID);
          }}
          className="stroke-gray-500 hover:stroke-rose-500 hover:bg-columnBackgroundColor rounded px-1 py-2"
        >
          <TrashIcon />
        </button>
      </div>
      {/* Lane Job List */}
      <div className="flex flex-grow flex-col gap-4 p-2 overflow-x-hidden overflow-y-auto">
        <SortableContext items={jobsIDs}>
          {jobs.map((job) => (
            <JobCard key={job.jobID} job={job} deleteJob={deleteJob} updateJob={updateJob} />
          ))}
        </SortableContext>
      </div>
      {/* Lane Footer */}
      <button
        className="flex gap-2 items-center border-columnBackgroundColor border-2 rounded-md p-4 border-x-columnBackgroundColor hover:bg-mainBackgroundColor hover:text-rose-500 active:bg-black"
        onClick={() => {
          createJob(lane.laneID);
        }}
      >
        <PlusIcon />
        Add New Job
      </button>
    </div>
  );
}
export default JobLane;
