import { NextRouter } from "next/router";

export type PageProps = {
  user?: User;
};

export type WithRouter = {
  router: NextRouter;
};

export type Fr = {
  _id: string;
  user: User;
  type: string;
};

export type Friends = {
  _id: string;
  user: User;
  channel: string;
};

export type User = {
  _id: string;
  username: string;
  fr: [Fr];
  friends: [Friends];
};

export enum FrType {
  IN = "in",
  OUT = "out",
}
