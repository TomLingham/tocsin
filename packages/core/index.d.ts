interface IWorkerBaseEvent {
  type: string;
}

interface IWorkerEvent {
  channel?: SlackChannelName;
  jobName: string;
}

interface IWorkerFailureEvent extends IWorkerEvent {
  type: "failure";
  failingSince: Date;
  error: Error;
}

interface IWorkerRecoveredEvent extends IWorkerEvent {
  type: "recovery";
  failingSince: Date;
  recoveredAt: Date;
}

interface IWorkerRegistrationEvent extends IWorkerEvent {
  type: "registration";
  nextRun: Date;
}

interface IWorkerIpcEvent extends IWorkerEvent {
  type: "ipc:request";
  payload: any;
}

interface IWorkerIpcRequestEvent extends IWorkerIpcEvent {
  resource: string;
  port: any; //TODO: better type...
}

interface IWorkerIpcResponseEvent extends IWorkerIpcEvent {}

declare type IWorkerStatusEvent =
  | IWorkerFailureEvent
  | IWorkerRecoveredEvent
  | IWorkerRegistrationEvent;

declare type SlackChannelName = `#${string}` | `@${string}`;

declare interface IMonitorOpts {
  channel?: SlackChannelName;
  cron: string;
  task: () => void;
}

declare namespace tocsin {
  declare const monitor: typeof import("./module/types").monitor;
  declare const http: typeof import("@tocsin/http");
}
