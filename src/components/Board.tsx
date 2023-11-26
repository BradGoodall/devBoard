import { useMemo, useState } from "react";
import { Lane, Id, Job } from "../types";
import PlusIcon from "../assets/icons/PlusIcon";
import JobLane from "./JobLane";
import {
  DndContext,
  DragCancelEvent,
  DragEndEvent,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { SortableContext, arrayMove } from "@dnd-kit/sortable";
import { createPortal } from "react-dom";

function Board() {
  const [lanes, setLanes] = useState<Lane[]>([]);
  const lanesId = useMemo(() => lanes.map((lane) => lane.laneID), [lanes]);

  const [jobs, setJobs] = useState<Job[]>([]);

  const [activeLane, setActiveLane] = useState<Lane | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 3, // 3px
      },
    })
  );

  return (
    <div
      className="
      m-auto
      flex
      min-h-screen
      w-full
      items-center
      overflow-x-auto
      overflow-y-hidden
      px-[40px]"
    >
      <DndContext
        sensors={sensors}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
      >
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
                />
              ))}
            </SortableContext>
          </div>
          <button
            onClick={() => {
              addLane();
            }}
            className="
        h-[60px]
        w-[350px]
        min-w-[350px]
        cursor-pointer 
        rounded-lg
        bg-mainBackgroundColor
        border-2
        border-columnBackgroundColor
        p-3
        ring-rose-500
        hover:ring-2
        flex
        gap-2"
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
              />
            )}
          </DragOverlay>,
          document.body
        )}
      </DndContext>
    </div>
  );

  function addLane() {
    // Creates a new Lane
    const laneToAdd: Lane = {
      laneID: generateId(),
      title: `Lane ${lanes.length + 1}`,
    };

    setLanes([...lanes, laneToAdd]);
  }

  function generateId() {
    // Generate a random ID
    return Math.floor(Math.random() * 10001);
  }

  function deleteLane(id: Id) {
    const filteredLanes = lanes.filter((lane) => lane.laneID !== id);
    setLanes(filteredLanes);
  }

  function updateLane(id: Id, title: string) {
    const newLanes = lanes.map((lane) => {
      if (lane.laneID !== id) return lane;
      return { ...lane, title };
    });

    setLanes(newLanes);
  }

  function createJob(laneID: Id) {
    const newJob: Job = {
      jobID: generateId(),
      laneID,
      content: `Job ${jobs.length + 1}`,
    };

    setJobs([...jobs, newJob]);
  }

  function deleteJob(jobID: Id) {
    const newJobs = jobs.filter((job) => job.jobID !== jobID);
    setJobs(newJobs);
  }

  function onDragStart(event: DragCancelEvent) {
    if (event.active.data.current?.type === "Lane") {
      setActiveLane(event.active.data.current.lane);
      return;
    }
  }

  function onDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over) return;

    const activeLaneId = active.id;
    const overLaneId = over.id;

    if (activeLaneId === overLaneId) return;

    setLanes((lanes) => {
      const activeLaneIndex = lanes.findIndex(
        (lane) => lane.laneID === activeLaneId
      );

      const overLaneIndex = lanes.findIndex(
        (lane) => lane.laneID === overLaneId
      );

      return arrayMove(lanes, activeLaneIndex, overLaneIndex);
    });
  }
}

export default Board;
