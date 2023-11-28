import { Timestamp } from "firebase/firestore";

export type Id = string | number;

export type Lane = {
  laneID: string;
  laneTitle: string;
  lanePosition: number;
};

export type Job = {
  description: string;
  laneID: string;
  timeCreated: Timestamp;
  jobTitle: string;
  userID: string | undefined;
  jobID: string;
};

export type BoardData = {
  backgroundURL: string;
  boardTitle: string;
  ownerID: string;
  timeCreated: Timestamp;
};
