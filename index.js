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
  socket.on("init", (user) => {
    sockets[socket.id] = user;
    console.log(Object.keys(sockets).length);
    socket.emit("allUsers", sockets);
    io.emit("update", socket.id, user);
  });
  socket.on("disconnect", () => {
    // console.log("disconnect", id);
    delete sockets[socket.id];
    console.log(Object.keys(sockets).length);
    io.emit("remove", socket.id);
  });
  socket.on("artUpdate", (art) => {
    sockets[socket.id].art = art;
    io.emit("update", socket.id, sockets[socket.id]);
  });
  socket.on("message", (message) => {
    io.emit("message", socket.id, message);
  });
  //console.log(socket.request.query);
  //console.log("New client connected");
});

server.listen(3000, () => {
  console.log("listening on *:3000");
});
