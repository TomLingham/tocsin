interface IWorkerBaseEvent {
  type: string;
  channel?: SlackChannelName;
  jobName: string;
}

interface IWorkerFailureEvent extends IWorkerBaseEvent {
  type: "failure";
  failingSince: Date;
  error: Error;
}

interface IWorkerRecoveryEvent extends IWorkerBaseEvent {
  type: "recovery";
  failingSince: Date;
  recoveredAt: Date;
}

interface IWorkerRegistrationEvent extends IWorkerBaseEvent {
  type: "registration";
  nextRun: Date;
}

declare type IWorkerEvent =
  | IWorkerFailureEvent
  | IWorkerRecoveryEvent
  | IWorkerRegistrationEvent;

declare type SlackChannelName = `#${string}` | `@${string}`;

declare interface IMonitorOpts {
  channel?: SlackChannelName;
  cron: string;
  task: () => void;
}

declare namespace tocsin {
  const monitor: typeof import("./module/types").monitor;

  const http: {
    get: typeof import("@tocsin/http").get;
    post: typeof import("@tocsin/http").post;
  };
}
