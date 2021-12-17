import { NextRouter } from "next/router";

export type PageProps = {
  user?: {
    _id: string;
    username: string;
    fr: [Fr];
    friends: [User];
  };
};

export type WithRouter = {
  router: NextRouter;
};

export type Fr = {
  _id: string;
  user: User;
  type: string;
};

export type User = {
  _id: string;
  username: string;
};

export enum FrType {
  IN = "in",
  OUT = "out",
}
