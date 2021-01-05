import { CronJob } from "cron";
import { parentPort } from "worker_threads";

interface IMonitorOpts {
  channel?: SlackChannelName;
  cron: string;
  task: () => void;
}

const FUZZING_MS = 10_000;
const RESULT_TYPES = ["success", "fail"] as const;

type IResult = typeof RESULT_TYPES[any];
export type IMonitor = typeof monitor;

export function monitor(name: string, opts: IMonitorOpts) {
  // msOffset is randomly generated to spread the execution time of commonly
  // executed timeslots (for example on the hour). Instead of everything firing
  // at 1pm, each task would be offset by some random amount.
  const msOffset =
    Math.floor((Math.random() * FUZZING_MS - FUZZING_MS / 2) / 10) * 10;
  const handler = createWrappedHandler(name, opts);

  console.log(`Registering task "${name}" with fuzzing offset ${msOffset}`);

  const job = new CronJob({
    cronTime: opts.cron,
    onTick: () => void setTimeout(handler, msOffset),
    start: true,
  });

  raise({
    type: "registration",
    jobName: name,
    nextRun: job.nextDate().toDate(),
    channel: opts.channel,
  });
}

function createWrappedHandler(name: string, opts: IMonitorOpts) {
  let executionCount = 0;
  let previousResult: IResult | null = null;
  let failingSince: Date | null = null;

  function failure(error: Error) {
    if (failingSince == null) {
      failingSince = new Date();
    }

    raise({
      type: "failure",
      jobName: name,
      error: error,
      failingSince: failingSince!,
      channel: opts.channel,
    });

    previousResult = "fail";
  }

  function success() {
    if (previousResult === "fail") {
      raise({
        type: "recovery",
        jobName: name,
        failingSince: failingSince!,
        recoveredAt: new Date(),
        channel: opts.channel,
      });
    }

    failingSince = null;
    previousResult = "success";
  }

  return async () => {
    executionCount++;
    const timerLabel = `[${executionCount}] "${name}"`;

    try {
      console.time(timerLabel);
      await opts.task();
      success();
    } catch (error) {
      failure(error);
    } finally {
      console.timeEnd(timerLabel);
    }
  };
}

async function raise(event: IWorkerEvent) {
  parentPort?.postMessage(event);
}
