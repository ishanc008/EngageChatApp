require("dotenv").config();
const express = require("express");
const socketio = require("socket.io");
const http = require("http");
const cors = require("cors");
const connect = require("./dbConnection");
const room = require("./Models/roomSchema");
const { v4: uuidv4 } = require("uuid");

const PORT = process.env.PORT || 5001;

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(cors());
app.use(express.json());
app.use("/room", require("./Routes/chatRoutes"));
app.use("/users", require("./Routes/userRoutes"));

io.on("connection", (socket) => {
  console.log("we have a new connection");
  socket.on("joinRoom", (roomId) => {
    console.log("join room", roomId);
    socket.join(roomId);
    // callback();
  });

  socket.on("join", async (obj) => {
    console.log(socket.id);
    const { user, room_id } = obj;
    const msg = {
      name: "####",
      text: `${user.fullName} has joined`,
      createdAt: new Date(),
      id: "####",
    };
    socket.to(room_id).emit("message", msg);
    socket.to(room_id).emit("afterJoin", user);
  });

  socket.on("sendMessage", async (messageData, callback) => {
    ////store it in the database///
    // console.log(messageData);
    const { message, room_id, user_name, id } = messageData;
    const existingUser = await room.findOne({ room_id });
    // console.log(existingUser);
    console.log("SEND MSG");
    const msg = {
      message_id: uuidv4(),
      name: user_name,
      text: message,
      id: id,
      createdAt: new Date(),
    };
    // console.log(msg);
    // console.log(room_id);
    existingUser.messages.push(msg);
    io.to(room_id).emit("message", msg);
    await existingUser.save();
    // callback();
  });

  socket.on("makeMod", async (modDetails) => {
    const { idx, room_id } = modDetails;
    const existingUser = await room.findOne({ room_id });
    existingUser.users[idx] = { ...existingUser.users[idx], role: "Moderator" };
    await existingUser.save();
    io.to(room_id).emit("afterMakeMod", existingUser.users);
  });

  socket.on("removeMod", async (modDetails) => {
    const { idx, room_id } = modDetails;
    const existingUser = await room.findOne({ room_id });
    console.log(existingUser.users[idx]);
    existingUser.users[idx] = { ...existingUser.users[idx], role: "student" };
    await existingUser.save();
    console.log(existingUser.users[idx]);
    io.to(room_id).emit("afterMakeMod", existingUser.users);
  });

  socket.on("report", async ({ room_id, reportMessage }) => {
    // console.log(room_id, reportMessage);
    const existingRoom = await room.findOne({ room_id });
    let finalReport;
    let found = false;
    for (let i = 0; i < existingRoom.reports.length; i++) {
      if (
        existingRoom.reports[i].reportedMsgId === reportMessage.reportedMsgId
      ) {
        found = true;
        existingRoom.reports[i].reportedBy = [
          ...existingRoom.reports[i].reportedBy,
          reportMessage.reportedBy[0],
        ];
        break;
      }
    }
    if (!found) {
      existingRoom.reports = [...existingRoom.reports, reportMessage];
    }

    finalReport = existingRoom.reports;
    existingRoom.reports = [];
    existingRoom.reports = finalReport;
    io.to(room_id).emit("afterReport", existingRoom.reports);
    await existingRoom.save();
  });

  socket.on("deleteReport", async ({ room_id, deleteReportIndex }) => {
    const existingRoom = await room.findOne({ room_id });
    // console.log(existingUser.users[idx]);
    console.log("deleteReport", deleteReportIndex);
    for (let i = 0; i < existingRoom.reports.length; i++) {
      if (existingRoom.reports[i].reportedMsgId === deleteReportIndex) {
        existingRoom.reports.splice(i, 1);
        break;
      }
    }
    // existingRoom.reports.splice(deleteReportIndex, 1);
    await existingRoom.save();
    console.log(existingRoom.reports[deleteReportIndex]);
    io.to(room_id).emit("afterReport", existingRoom.reports);
  });

  // socket.on("report", async ({ room_id, reportMessage }) => {
  //   const existingRoom = await room.findOne({ room_id });
  //   console.log(existingRoom.reports);
  //   let found = false;
  //   for (let i = 0; i < existingRoom.reports.length; i++) {
  //     if (
  //       existingRoom.reports[i].reportedMsgId === reportMessage.reportedMsgId
  //     ) {
  //       found = true;
  //       existingRoom.reports[i].reportedBy.push(reportMessage.reportedBy[0]);
  //       await existingRoom.save();
  //       break;
  //     }
  //   }
  //   if (!found) {
  //     // existingRoom.reports = [...existingRoom.reports, reportMessage];
  //     existingRoom.reports.push(reportMessage);
  //     await existingRoom.save();
  //   }
  // });

  socket.on("deleteMessage", async (messageData) => {
    // const { messages, idx, room_id, message_id } = messageData;
    const { room_id, message_id } = messageData;
    console.log("deleteMessage", message_id);
    const existingUser = await room.findOne({ room_id });
    for (let i = 0; i < existingUser.messages.length; i++) {
      if (existingUser.messages[i].message_id === message_id) {
        existingUser.messages.splice(i, 1);
        break;
      }
    }
    await existingUser.save();
    const messages = existingUser.messages;
    io.to(room_id).emit("afterDelete", { messages });
  });

  socket.on("deleteReportMessage", async (messageData) => {
    const { room_id, message_id } = messageData;
    const existingRoom = await room.findOne({ room_id });
    for (let i = 0; i < existingRoom.messages.length; i++) {
      if (existingRoom.messages[i].message_id === message_id) {
        existingRoom.messages.splice(i, 1);
        break;
      }
    }
    for (let i = 0; i < existingRoom.reports.length; i++) {
      if (existingRoom.reports[i].reportedMsgId === message_id) {
        existingRoom.reports.splice(i, 1);
        break;
      }
    }
    await existingRoom.save();
    const messages = existingRoom.messages;
    io.to(room_id).emit("afterDelete", { messages });
    io.to(room_id).emit("afterReport", existingRoom.reports);
  });

  socket.on("leaveRoom", async (leaveRoomId) => {
    const { room_id, userId, type } = leaveRoomId;
    console.log(room_id, userId);
    const existingRoom = await room.findOne({ room_id });
    let user_name;
    for (let i = 0; i < existingRoom.users.length; i++) {
      if (existingRoom.users[i].id === userId) {
        user_name = existingRoom.users[i].fullName;
        existingRoom.users.splice(i, 1);
        break;
      }
    }
    if (type === "remove") {
      existingRoom.bannedUsers.push(userId);
    }
    await existingRoom.save();
    const userDetails = {
      users: existingRoom.users,
      room_name: existingRoom.room_name,
      userId: userId,
      room_id: room_id,
      user_name: user_name,
      type: type,
    };
    io.to(room_id).emit("afterLeaveRoom", userDetails);
  });

  socket.on("disconnect", () => {
    console.log("User had left");
  });
});

server.listen(PORT, () => console.log(`Server started at ${PORT}`));
