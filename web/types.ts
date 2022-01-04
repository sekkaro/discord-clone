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

export type Friend = {
  _id: string;
  user: User;
  channel: string;
};

export type User = {
  _id: string;
  username: string;
  fr: [Fr];
  friends: [Friend];
};

export enum FrType {
  IN = "in",
  OUT = "out",
}
