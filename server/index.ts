import express from "express";
import { createServer } from "http";
import next from "next";
import { Server } from "socket.io";

const main = () => {
  const app = express();
  const server = createServer(app);
  const io = new Server(server);

  const dev = process.env.NODE_ENV !== "production";

  const nextApp = next({ dev });
  const handle = nextApp.getRequestHandler();

  nextApp.prepare().then(() => {
    app.all("*", (req, res) => handle(req, res));

    io.on("connection", (socket) => {
      console.log("new web socket connection");

      socket.on("join", () => {});

      socket.on("disconnect", () => {});
    });

    const port = process.env.PORT || 3000;

    server.listen(port, () => {
      console.log(`Server is up on port ${port}`);
    });
  });
};

main();
