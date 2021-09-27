import { NextPageContext } from "next";
import Router from "next/router";

export const redirectUser = (ctx: NextPageContext, location: string) => {
  if (ctx.req) {
    ctx.res?.writeHead(302, {
      Location: location,
    });
    ctx.res?.end();
  } else {
    Router.replace(location);
  }
};
