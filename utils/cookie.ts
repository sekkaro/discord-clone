import cookie from "cookie";
import { NextApiResponse } from "next";

export const setCookie = (res: NextApiResponse, token: string) => {
  res.setHeader(
    "Set-cookie",
    cookie.serialize("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 3600,
      path: "/",
    })
  );
};
