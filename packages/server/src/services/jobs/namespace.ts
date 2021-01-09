import * as slack from "../slack";
import { Worker, MessageChannel } from "worker_threads";
import { WORKER_RESTART_TIMEOUT_MS } from "../../config";
import { Namespaces } from "../data/namespaces";

const PATH_TO_WORKER_MODULE = require.resolve("@tocsin/worker");

type Logger = (buffer: Buffer | string) => void;

export class TocsinWorker {
  #code: string;
  #ns: string;
  #worker: Worker | null = null;
  #exitScheduled: boolean = false;

  #logErr: Logger;
  #logStd: Logger;

  constructor(namespace: string, code: string) {
    this.#code = code;
    this.#ns = namespace;
    this.#logErr = createLogger(namespace, process.stderr);
    this.#logStd = createLogger(namespace, process.stdout);
  }

  async start() {
    this.#worker = new Worker(PATH_TO_WORKER_MODULE, {
      argv: [this.#code],
      stdout: true,
    });

    this.#worker.stdout.on("data", this.#logStd);
    this.#worker.stderr.on("data", this.#logErr);

    this.#worker.on("message", this.onReceiveMessageEvent);
    this.#worker.on("error", this.onReceiveErrorEvent);
    this.#worker.on("exit", this.onReceiveExitEvent);
  }

  public getNamespace() {
    return this.#ns;
  }

  public async fetch<T = any>(resource: string): Promise<T> {
    const { port1, port2 } = new MessageChannel();
    this.#worker?.postMessage({ type: "ipc:request", resource, port: port2 }, [
      port2,
    ]);
    return new Promise((resolve) => {
      port1.on("message", resolve);
    });
  }

  private onReceiveExitEvent = () => {
    if (this.#exitScheduled) {
      this.handleScheduledExit();
    } else {
      this.handleUnscheduledExit();
    }
  };

  private onReceiveErrorEvent = async (error: Error) => {
    console.log(error);
    this.#logErr(error.message);
  };

  private onReceiveMessageEvent = async (event: IWorkerStatusEvent) => {
    if (event.type === "registration") this.handleRegistrationEvent(event);
    if (event.type === "failure") this.handleFailureEvent(event);
    if (event.type === "recovery") this.handleRecoveredEvent(event);
  };

  private handleRegistrationEvent = (event: IWorkerRegistrationEvent) => {
    slack.registered(this.#ns, event);
  };

  private handleFailureEvent = (event: IWorkerFailureEvent) => {
    slack.failure(this.#ns, event);
  };

  private handleRecoveredEvent = (event: IWorkerRecoveredEvent) => {
    slack.recovered(this.#ns, event);
  };

  private handleScheduledExit = () => this.#worker?.terminate();

  private handleUnscheduledExit = () => {
    // In the unlikely event that the worker exits and it's not scheduled, we'll
    // try to load it again after a sane timeout.
    // TODO: exponential back-off with alerts raised...
    const restartSeconds = WORKER_RESTART_TIMEOUT_MS / 1000;
    this.#logStd(`Restart in ${restartSeconds}s`);

    setTimeout(
      () => registerNamespace(this.#ns, this.#code),
      WORKER_RESTART_TIMEOUT_MS
    );
  };
}

/**
 * Register a job for the given namespace and register any corresponding
 * workers (if there are any defined within the corresponding code blobs).
 *
 * @param namespace
 * @param code
 */
export async function registerNamespace(name: string, code: string) {
  console.log("Registered namespace", { name });
  const namespace = new TocsinWorker(name, code);
  Namespaces.add(namespace);

  await namespace.start();
}

/**
 * Create a logging function to handle the 'data' event of the worker std* output.
 *
 * @param ns Worker namespace.
 * @param stream the writeable stream to send the logs to.
 */
function createLogger(ns: string, stream: NodeJS.WritableStream): Logger {
  return (message: Buffer | string) => {
    const prefix = `[${ns}]`.padEnd(15, " ");
    stream.write(message.toString().replace(/(.*)\n/g, `${prefix} $1\n`));
  };
}
