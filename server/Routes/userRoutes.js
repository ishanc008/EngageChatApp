const express = require("express");
const users = require("../Models/userSchema");
const room = require("../Models/roomSchema");
const role = require("../Models/rolesSchema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const auth = require("../Middleware/auth");
const secret = process.env.SECRET;

const router = express.Router();

////// UNCOMMENT TO ADD MORE ROLES //////
// router.post("/roles", async (req, res) => {
//   const { name, adminPerms, modPerms } = req.body;
//   console.log(name, adminPerms, modPerms);
//   const newRole = await role.create({
//     name: name,
//     adminPerms: adminPerms,
//     modPerms: modPerms,
//   });
//   res.status(200).json(newRole);
// });

router.post("/signIn", async (req, res) => {
  const { email, password } = req.body;
  try {
    const existingUser = await users.findOne({ email });
    if (!existingUser) {
      return res.status(404).json({ message: "No user found" });
    }
    const isPasswordCorrect = await bcrypt.compare(
      password,
      existingUser.password
    );

    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Password incorrect" });
    }

    const token = jwt.sign(
      { email: existingUser.email, id: existingUser._id },
      secret,
      { expiresIn: "12h" }
    );

    const obj = {
      fullName: existingUser.name,
      email: existingUser.email,
      id: existingUser._id,
    };
    res.status(200).json({ obj, token });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
    console.log(error);
  }
});

router.route("/signUp").post(async (req, res) => {
  console.log(req.body);
  const { email, password, confirmPassword, fullName } = req.body;
  try {
    const existingUser = await users.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already registered" });
    }
    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Password Mismatch" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await users.create({
      name: fullName,
      email: email,
      password: hashedPassword,
    });

    const token = jwt.sign({ email: email, id: user._id }, secret, {
      expiresIn: "12h",
    });

    const obj = {
      fullName: fullName,
      email: email,
      id: user._id,
    };

    res.status(200).json({ obj, token });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
    console.log(error);
  }
});

router.get("/getRooms/:id", auth, async (req, res) => {
  const id = req.params.id;
  await room
    .find({}, (err, room) => {
      if (!err) {
        // console.log(room);
        let userRooms = [];
        for (let i = 0; i < room.length; i++) {
          let found = false;
          for (let j = 0; j < room[i].users.length; j++) {
            if (room[i].users[j].id === id) {
              found = true;
              break;
            }
          }
          if (found) {
            const obj = {
              room_name: room[i].room_name,
              room_id: room[i].room_id,
            };
            userRooms.push(obj);
          }
        }
        res.status(200).json({ userRooms });
      } else {
        throw err;
      }
    })
    .clone()
    .catch(function (err) {
      console.log(err);
      res.status(500).json({ message: "something went wrong" });
    });
});

module.exports = router;
