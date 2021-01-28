import { Jobs } from "../data";

export async function jobs() {
  return [...Jobs].map((job) => ({
    name: job.name,
    msOffset: job.msOffset,
    nextRunTime: job.job.nextDate().toDate(),
    lastRunTime: job.job.lastDate(),
    running: job.job.running,
    channel: job.channel,
    cron: job.cron,
  }));
}
