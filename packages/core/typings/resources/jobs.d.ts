type IWorkerResources = {
  jobs: IWorkerResourcesJob[];
};

interface IWorkerResourcesJob {
  channel: SlackChannelName;
  cron: string;
  msOffset: number;
  name: string;
  nextRunTime: Date;
  lastRunTime: Date;
  running: boolean;
}

type WorkerResource = keyof IWorkerResources;
