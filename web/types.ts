export type PageProps = {
  user?: {
    _id: string;
    username: string;
    fr: [
      {
        _id: string;
        user: {
          username: string;
        };
        type: string;
      }
    ];
  };
};

export enum FrType {
  IN = "in",
  OUT = "out",
}
