import KoaRouter from "@koa/router";
import { router as namespacesRouter } from "./namespaces";
import { router as adminRouter } from "./admin";

export const router = new KoaRouter({ prefix: "/api" });

router.use(namespacesRouter.routes());
router.use(adminRouter.routes());
