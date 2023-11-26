import TrashIcon from "../assets/icons/TrashIcon";
import { Id, Job } from "../types";
import { useState } from "react";

interface Props {
  job: Job;
  deleteJob: (jobID: Id) => void;
}

function JobCard({ job, deleteJob }: Props) {
  const [mouseIsOver, setMouseIsOver] = useState(false);

  return (
    <div
      className="
  bg-mainBackgroundColor
  p-2.5
  h-[100px]
  min-h-[100px]
  items-center
  flex
  text-left
  rounded-xl
  hover:ring-2
  hover:ring-inset
  hover:ring-rose-500
  cursor-grab
  relative"
      onMouseEnter={() => setMouseIsOver(true)}
      onMouseLeave={() => setMouseIsOver(false)}
    >
      {job.content}

      {mouseIsOver && (
        <button
          className="
      stroke-white
      absolute
      right-4
      top-1/2-translate-y-1/2
      bg-columnBackgroundColor
      p-2
      rounded"
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
