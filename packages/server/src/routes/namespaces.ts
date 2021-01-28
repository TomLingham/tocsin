import KoaRouter from "@koa/router";
import { Namespaces } from "../services/data/namespaces";

export const router = new KoaRouter({ prefix: "/namespaces" });

router.get("/", async (ctx) => {
  ctx.body = [...Namespaces].map((ns) => ns.getNamespace());
});

router.get("/:id", async (ctx) => {
  const { id } = ctx.params;
  const ns = [...Namespaces].find((ns) => ns.getNamespace() === id);
  if (ns != null)
    ctx.body = {
      id,
      jobs: await ns.getJobs(),
    };
});
