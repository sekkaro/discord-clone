import type { AppContext, AppProps } from "next/app";
import { ChakraProvider } from "@chakra-ui/react";
import fetch from "isomorphic-unfetch";

import theme from "../theme";
import { PageProps } from "../types";
import { redirectUser } from "../utils/redirectUser";

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
  const res = await fetch("http://localhost:3001/api/auth/me", {
    credentials: "include",
    headers: {
      cookie: (ctx.req as any)?.headers.cookie,
    },
  });
  const protectedRoute =
    ctx.pathname !== "/login" && ctx.pathname !== "/register";
  if (!res.ok) {
    if (protectedRoute) {
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
