import Koa from "koa";
import { router } from "./routes";

const app = new Koa();

app.use(router.routes());

export function start(port = 3000): Promise<void> {
  console.log("Tocsin is starting...");
  return new Promise((resolve) => app.listen(port, resolve));
}
