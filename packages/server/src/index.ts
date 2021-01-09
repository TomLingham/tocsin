import * as app from "./server";
import { JOB_DEFINITIONS_URL } from "./config";
import { getJobDefinitions } from "./services/jobs";
import { registerNamespace } from "./services/jobs/namespace";

getJobDefinitions(JOB_DEFINITIONS_URL)
  .then(async (jobs) => {
    for (let namespace in jobs)
      await registerNamespace(namespace, jobs[namespace]);
  })
  .then(() => app.start())
  .then(() => {
    console.log("Tocsin has started. API is ready.");
  });
