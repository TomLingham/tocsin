interface IWorkerBaseEvent {
  type: string;
  message: string;
}

interface IWorkerFailureEvent extends IWorkerBaseEvent {
  type: "failure";
  failingSince: Date;
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
