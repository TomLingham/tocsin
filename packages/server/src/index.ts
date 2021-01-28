import * as app from "./server";
import { load } from "./load";

load()
  .then(() => app.start())
  .then(() => {
    console.log("Tocsin has started. API is ready.");
  });
