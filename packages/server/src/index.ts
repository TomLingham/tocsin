import * as app from "./server";
import { JOB_DEFINITIONS_URL } from "./config";
import { getJobDefinitions, registerJob } from "./services/jobs";

getJobDefinitions(JOB_DEFINITIONS_URL)
  .then(async (jobs) => {
    for (let namespace in jobs) await registerJob(namespace, jobs[namespace]);
  })
  .then(() => app.start())
  .then(() => {
    console.log("Tocsin has started. API is ready.");
  });
