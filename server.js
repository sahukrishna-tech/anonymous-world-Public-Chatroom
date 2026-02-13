const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);

app.use(express.static("public"));

io.on("connection", socket => {

  // User joined
  socket.broadcast.emit("message", {
    type: "system",
    text: "A stranger joined the chat"
  });

  // Chat message
  socket.on("chatMessage", msg => {
    // Send to sender
    socket.emit("message", {
      type: "chat",
      text: msg,
      self: true
    });

    // Send to others
    socket.broadcast.emit("message", {
      type: "chat",
      text: msg,
      self: false
    });
  });

  // Typing indicator
  socket.on("typing", () => {
    socket.broadcast.emit("typing");
  });

  // User disconnected
  socket.on("disconnect", () => {
    socket.broadcast.emit("message", {
      type: "system",
      text: "A stranger left the chat"
    });
  });

});

http.listen(3000, () => {
  console.log("FeelBuddy backend running on http://localhost:3000");
});
trail/server.js