import type { CronJob } from "cron";

interface IJobRegistration {
  msOffset: number;
  name: string;
  job: CronJob;
  cron: string;
  channel?: SlackChannelName;
}

export const Jobs = new Set<IJobRegistration>();
