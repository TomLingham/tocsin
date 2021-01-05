interface IWorkerBaseEvent {
  type: string;
  channel?: SlackChannelName;
  jobName: string;
}

interface IWorkerFailureEvent extends IWorkerBaseEvent {
  type: "failure";
  failingSince: Date;
  error: Error,
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

type IWorkerEvent =
  | IWorkerFailureEvent
  | IWorkerRecoveryEvent
  | IWorkerRegistrationEvent;
