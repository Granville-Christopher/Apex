// socket.js
const { Server } = require("socket.io");
const Message = require("./models/usermodel/message");

const connectedUsers = {};

function setupSocket(server) {
  const io = new Server(server);

  io.on("connection", (socket) => {
    console.log("🟢 Client connected");

    socket.on("register", (userId) => {
      connectedUsers[userId] = socket.id;
    });

    socket.on("sendMessage", async ({ sender, to, message }) => {
      const msg = await new Message({ sender, to, message }).save();

      socket.emit("receiveMessage", msg);

      const receiverSocketId = connectedUsers[to];
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("receiveMessage", msg);
      }
    });

    socket.on("disconnect", () => {
      for (let userId in connectedUsers) {
        if (connectedUsers[userId] === socket.id) {
          delete connectedUsers[userId];
          break;
        }
      }
      console.log("🔴 Client disconnected");
    });
  });

  return { io, connectedUsers };
}

module.exports = setupSocket;
