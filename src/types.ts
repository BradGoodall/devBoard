export type Id = string | number;

export type Lane = {
  laneID: Id;
  title: string;
};

export type Job = {
  jobID: Id;
  laneID: Id;
  content: string;
};
