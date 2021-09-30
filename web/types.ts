export type PageProps = {
  user?: {
    _id: string;
    username: string;
    fr: [Fr];
  };
};

export type Fr = {
  _id: string;
  user: {
    username: string;
  };
  type: string;
};

export enum FrType {
  IN = "in",
  OUT = "out",
}
