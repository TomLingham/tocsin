import KoaRouter from "@koa/router";
import { load } from "../load";
import { Namespaces } from "../services/data/namespaces";

export const router = new KoaRouter({ prefix: "/admin" });

router.get("/reload", async (ctx) => {
  for (const ns of Namespaces) {
    await ns.delete();
    Namespaces.clear();
  }

  try {
    await load();
    ctx.body = { error: false };
  } catch (error) {
    ctx.body = { error: true };
    ctx.status = 500;
  }
});
