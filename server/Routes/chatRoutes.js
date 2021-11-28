const express = require("express");
const room = require("../Models/roomSchema");
const { v4: uuidv4 } = require("uuid");
const auth = require("../Middleware/auth");

const router = express.Router();

router.get("/getChats/:roomId", auth, async (req, res) => {
  //complete the getChat API request
  const room_id = req.params.roomId;
  // console.log(room_name);
  try {
    const existingRoom = await room.findOne({ room_id });
    // console.log(existingRoom);
    res.status(200).json({
      users: existingRoom.users,
      chats: existingRoom.messages,
      reports: existingRoom.reports,
      bannedUsers: existingRoom.bannedUsers
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "something went wrong" });
  }
});

// router.route("/createRoom").post(async (req, res) => {
router.post("/createRoom", auth, async (req, res) => {
  console.log(req.body);
  const { room_name, room_password, user } = req.body;
  const makeid = (length) => {
    var result = "";
    var characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  };
  let roomIdArray;
  try {
    await room
      .find({}, (err, room) => {
        if (!err) {
          console.log(room);
          roomIdArray = room;
        } else {
          throw err;
        }
      })
      .clone()
      .catch(function (err) {
        console.log(err);
      });
    let present = true;
    let room_id = makeid(5);
    // console.log(roomIdArray);
    if (roomIdArray) {
      while (present) {
        room_id = makeid(5);
        console.log(room_id);
        let found = false;
        for (let i = 0; i < roomIdArray.length; i++) {
          if (roomIdArray.room_id === room_id) {
            found = true;
            break;
          }
        }
        if (!found) {
          break;
        }
      }
    }
    console.log(room_id);

    const msg = {
      message_id: uuidv4(),
      name: "####",
      text: `${user.fullName} has created this room`,
      createdAt: new Date(),
      id: "####",
    };

    const userWithPerms = { ...user, role: "Admin" };
    const newRoom = await room.create({
      room_name: room_name,
      room_password: room_password,
      room_id: room_id,
      messages: [msg],
      users: [userWithPerms],
    });

    //////add the room id to users schema///////

    res.status(200).json({ newRoom });
  } catch (error) {
    res.status(500).json({ message: "something went wrong" });
    console.log(error);
  }
});

router.post("/joinRoom", auth, async (req, res) => {
  // router.route("/joinRoom").post(async (req, res) => {
  console.log(req.body);
  const { room_id, room_password, user } = req.body;
  try {
    const existingRoom = await room.findOne({ room_id });
    if (!existingRoom) {
      return res.status(404).json({ message: "Room doesn't exists" });
    }
    // console.log(existingRoom);
    if (room_password !== existingRoom.room_password) {
      return res.status(400).json({ message: "Incorrect Credentials" });
    }

    let found = "";
    for (let i = 0; i < existingRoom.users.length; i++) {
      if (existingRoom.users[i].id === user.id) {
        found = "true";
        break;
      }
    }
    for (let i = 0; i < existingRoom.bannedUsers.length; i++) {
      if (existingRoom.bannedUsers[i] === user.id) {
        return res
          .status(400)
          .json({ message: "You are banned from this room" });
      }
    }
    if (found === "true") {
      return res.status(400).json({ message: "user found" });
    }
    const msg = {
      message_id: uuidv4(),
      name: "####",
      text: `${user.fullName} has joined`,
      createdAt: new Date(),
      id: "####",
    };
    existingRoom.users.push(user);
    existingRoom.messages.push(msg);
    await existingRoom.save();
    res.status(200).json(existingRoom);
  } catch (error) {
    res.status(500).json({ message: "something went wrong" });
    console.log(error);
  }
});

module.exports = router;
