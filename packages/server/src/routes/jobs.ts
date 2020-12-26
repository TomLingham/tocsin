import KoaRouter from "@koa/router";

export const router = new KoaRouter();

router.get("/", (ctx) => {
  console.log(ctx.url);
});
