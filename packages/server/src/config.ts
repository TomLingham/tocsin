/**
 * The URL to load the job definitions file from on startup.
 */
export const JOB_DEFINITIONS_URL =
  process.env.JOB_DEFINITIONS_URL ?? "http://localhost:8000/jobs.json";

/**
 * The default slack channel to post alerts / messages to. This can be
 * overridden per monitoring task.
 */
export const SLACK_DEFAULT_CHANNEL: SlackChannelName =
  (process.env.SLACK_DEFAULT_CHANNEL as any) ?? ("@UT6CP97JN" as const); // TODO: validate these env variables...

/**
 * The slack incoming webhook url for your slack workspace.
 */
export const SLACK_HOOK_URL = process.env.SLACK_HOOK_URL ?? "";

/**
 * The time to pass before attempting to restart a worker that has quit
 * unexpectedly.
 */
export const WORKER_RESTART_TIMEOUT_MS = 10_000;
