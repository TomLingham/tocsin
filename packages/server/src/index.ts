import * as app from "./server";

app.start().then(() => {
  console.log("Chime has started. Waiting for configuration.");
});
