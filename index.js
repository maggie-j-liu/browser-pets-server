const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: true,
  },
});

app.get("/", (req, res) => {
  res.send("<h1>Hello world</h1>");
});

let sockets = {};
io.on("connection", (socket) => {
  socket.on("init", (art) => {
    sockets[socket.id] = {
      art,
    };
    console.log(Object.keys(sockets).length);
    io.emit("update", socket.id, art);
  });
  socket.on("disconnect", () => {
    // console.log("disconnect", id);
    delete sockets[socket.id];
    console.log(Object.keys(sockets).length);
    io.emit("remove", socket.id);
  });
  socket.on("artUpdate", (art) => {
    sockets[socket.id].art = art;
    io.emit("update", socket.id, art);
  });
  //console.log(socket.request.query);
  //console.log("New client connected");
});

server.listen(3000, () => {
  console.log("listening on *:3000");
});
