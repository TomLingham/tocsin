import { JOB_DEFINITIONS_URL } from "./config";
import { getJobDefinitions } from "./services/jobs";
import { registerNamespace } from "./services/jobs/namespace";

export async function load() {
  console.log("Loading job definitions", JOB_DEFINITIONS_URL);
  const jobs = await getJobDefinitions(JOB_DEFINITIONS_URL);

  console.log("Jobs to be loaded", jobs);

  for (let namespace in jobs) {
    await registerNamespace(namespace, jobs[namespace]);
  }
}
