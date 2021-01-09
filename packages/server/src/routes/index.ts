import KoaRouter from "@koa/router";
import { router as jobsRouter } from "./jobs";

export const router = new KoaRouter({ prefix: "/api" });

router.use(jobsRouter.routes());
