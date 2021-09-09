import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";

const main = () => {
  const app = express();

  mongoose.connect(process.env.MONGO_URL as string);

  app.use(express.json());
  app.use(helmet());
  app.use(cors());
  app.use(morgan("common"));

  const port = process.env.PORT || 3001;

  app.listen(port, () => {
    console.log("Backend server is running");
  });
};

main();
