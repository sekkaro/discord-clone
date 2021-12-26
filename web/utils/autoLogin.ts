import { GetServerSideProps } from "next";

export const autoLogin: GetServerSideProps = async (ctx) => {
  const res = await fetch(`${process.env.API_URI}/api/auth/me`, {
    credentials: "include",
    headers: {
      cookie: (ctx.req as any)?.headers.cookie,
    },
  });

  if (res.ok) {
    return {
      redirect: {
        permanent: false,
        destination: "/",
      },
    };
  }

  return {
    props: {},
  };
};
