import KoaRouter from "@koa/router";
import { Namespaces } from "../services/data/namespaces";

export const router = new KoaRouter({ prefix: "/jobs" });

router.get("/", async (ctx, next) => {
  const collection: Record<string, any> = {};
  for (const ns of Namespaces) {
    const name = ns.getNamespace();
    collection[name] = await ns.fetch("/jobs");
  }
  ctx.body = collection;
});
