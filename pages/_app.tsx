import type { AppContext, AppProps } from "next/app";
import { ChakraProvider } from "@chakra-ui/react";
import fetch from "isomorphic-unfetch";

import theme from "../theme";
import { redirectUser } from "../utils/redirectUser";
import { PageProps } from "../types";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={theme}>
      <Component {...pageProps} />
    </ChakraProvider>
  );
}

MyApp.getInitialProps = async (appContext: AppContext) => {
  const { ctx, Component } = appContext;
  let pageProps: PageProps = {};
  const cookie = ctx.req?.headers.cookie;
  const res = await fetch("http://localhost:3000/api/me", {
    headers: {
      cookie: cookie!,
    },
  });
  const protectedRoute =
    ctx.pathname !== "/login" && ctx.pathname !== "/register";
  if (!res.ok) {
    if (res.status === 403 && protectedRoute) {
      redirectUser(ctx, "/login");
    }

    return { pageProps };
  }

  if (!protectedRoute) {
    redirectUser(ctx, "/");
  }

  if (Component.getInitialProps) {
    pageProps = await Component.getInitialProps(ctx);
  }

  const user = await res.json();
  pageProps.user = user;
  return { pageProps };
};
export default MyApp;
