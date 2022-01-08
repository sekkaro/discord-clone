import { Response } from "express";

export const setCookie = (res: Response, token: string) => {
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 3600 * 1000,
    domain: process.env.BASE_DOMAIN,
    path: "/",
  });
};
