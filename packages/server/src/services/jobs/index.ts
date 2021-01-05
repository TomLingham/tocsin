import fs from "fs/promises";
import * as slack from "../slack";
import * as http from "@tocsin/http";
import { Worker } from "worker_threads";
import { WORKER_RESTART_TIMEOUT_MS } from "../../config";

interface IJobResources {
  [namespace: string]: string;
}

/**
 * Load job definitions from the defined URL resource.
 *
 * This can be a local file, or if starting with a http or https protocol will
 * be loaded over the network.
 */
export async function getJobDefinitions(
  resource: string
): Promise<IJobResources> {
  const rawJobDefinitions = /^https?:\/\//.test(resource)
    ? await http.get(resource).then((res) => res.body)
    : (await fs.readFile(resource)).toString();

  const jobResources: IJobResources = JSON.parse(rawJobDefinitions);

  // TODO: Better schema validation
  if (typeof jobResources !== "object" || jobResources == null) {
    throw new Error("InvalidJobDefinitions");
  }

  for (const namespace in jobResources) {
    if (typeof jobResources[namespace] !== "string") {
      throw new Error("InvalidJobDefinitions");
    }
  }

  return jobResources;
}

export async function registerJob(namespace: string, code: string) {
  const workerModulePath = require.resolve("@tocsin/worker");

  const worker = new Worker(workerModulePath, { argv: [code], stdout: true });
  worker.stdout.on("data", createWorkerLogger(namespace, process.stdout));
  worker.stderr.on("data", createWorkerLogger(namespace, process.stderr));

  worker.on("error", (error) => {
    console.error(`${namespace} worker error. ${error.message}`);
  });

  worker.on("message", (event: IWorkerEvent) => {
    if (event.type === "registration") slack.registered(namespace, event);
    if (event.type === "failure") slack.failure(namespace, event);
    if (event.type === "recovery") slack.recovered(namespace, event);
  });

  worker.on("exit", () => {
    // In the unlikely event that the worker is unable to be recovered, we'll
    // try to load it again after the timeout.
    // TODO: exponential back-off with alerts raised...
    console.log(
      `${namespace} Restart in ${Math.round(WORKER_RESTART_TIMEOUT_MS / 1000)}s`
    );
    setTimeout(() => registerJob(namespace, code), WORKER_RESTART_TIMEOUT_MS);
  });

  return new Promise((resolve) => worker.on("online", resolve));
}

/**
 * Create a logging function to handle the 'data' event of the worker std* output.
 *
 * @param namespace Worker namespace.
 * @param stream the writeable stream to send the logs to.
 */
function createWorkerLogger(namespace: string, stream: NodeJS.WritableStream) {
  return (message: Buffer) => {
    const ns = `[${namespace}]`.padEnd(15, " ");
    stream.write(message.toString().replace(/(.*)\n/g, `${ns} $1\n`));
  };
}
