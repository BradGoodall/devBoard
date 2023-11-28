import { useSortable } from "@dnd-kit/sortable";
import TrashIcon from "../assets/icons/TrashIcon";
import { Id, Job } from "../types";
import { useState } from "react";
import { CSS } from "@dnd-kit/utilities";

interface Props {
  job: Job;
  deleteJob: (jobID: Id) => void;
  updateJob: (jobID: Id, jobTitle: string) => void;
}

function JobCard({ job, deleteJob, updateJob }: Props) {
  const [mouseIsOver, setMouseIsOver] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const { setNodeRef, attributes, listeners, transform, transition, isDragging } = useSortable({
    id: job.jobID,
    data: {
      type: "Job",
      job,
    },
    disabled: editMode,
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  const toggleEditMode = () => {
    setEditMode((prev) => !prev);
    setMouseIsOver(false);
  };

  if (isDragging) {
    return <div ref={setNodeRef} style={style} className="opacity-50 bg-mainBackgroundColor p-2.5 h-[100px] min-h-[100px] rounded-xl border border-rose-500"></div>;
  }

  // Edit Mode
  if (editMode) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className="bg-mainBackgroundColor p-2.5 h-[100px] min-h-[100px] items-center flex text-left rounded-xl hover:ring-2 hover:ring-inset hover:ring-rose-500 cursor-grab relative"
      >
        <textarea
          value={job.jobTitle}
          autoFocus
          placeholder="Enter Job Title"
          onBlur={toggleEditMode}
          onKeyDown={(e) => {
            if (e.key === "Enter") toggleEditMode;
          }}
          onChange={(e) => updateJob(job.jobID, e.target.value)}
          className="h-[90%] w-full resize-none border-none rounded bg-transparent text-white focus:outline-none"
        ></textarea>
        {mouseIsOver && (
          <button
            className=" stroke-white absolute right-4 top-1/2-translate-y-1/2 bg-columnBackgroundColor p-2 rounded"
            onClick={() => {
              deleteJob(job.jobID);
            }}
          >
            <TrashIcon />
          </button>
        )}
      </div>
    );
  }

  // Regular Card View
  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={toggleEditMode}
      className="bg-mainBackgroundColor p-2.5 min-h-[100px] max-h-max items-center text-left rounded-xl hover:ring-2 hover:ring-inset hover:ring-rose-500 cursor-grab relative"
      onMouseEnter={() => setMouseIsOver(true)}
      onMouseLeave={() => setMouseIsOver(false)}
    >
      <div className="text-xs bg-rose-500 h-auto max-w-max rounded p-1 flex text-white">Urgent</div>
      <div className="my-auto overflow-y-auto overflow-x-hidden whitespace-pre-wrap">{job.jobTitle}</div>
      {/* <div className="mt-2 text-sm">
        Debug Information:
        <br /> JobID: {job.jobID}
        <br /> LaneID: {job.laneID}
      </div> */}

      {mouseIsOver && (
        <button
          className=" stroke-white absolute right-4 top-1/2-translate-y-1/2 bg-columnBackgroundColor p-2 rounded"
          onClick={() => {
            deleteJob(job.jobID);
          }}
        >
          <TrashIcon />
        </button>
      )}
    </div>
  );
}
export default JobCard;
