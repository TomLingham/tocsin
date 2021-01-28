/**
 * Status Events (Consumed by Slack or other feed)
 */
interface IWorkerEvent {
  type: string;
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

declare type IWorkerStatusEvent =
  | IWorkerFailureEvent
  | IWorkerRecoveredEvent
  | IWorkerRegistrationEvent;

/**
 * IPC Events
 */
interface IWorkerIpcEvent extends IWorkerEvent {
  payload: any;
}

interface IWorkerIpcRequestEvent extends IWorkerIpcEvent {
  resource: string;
  port: import("worker_threads").MessagePort;
}

interface IWorkerIpcResponseEvent extends IWorkerIpcEvent {}
