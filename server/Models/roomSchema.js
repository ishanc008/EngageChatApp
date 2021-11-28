const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const roomSchema = new Schema({
  room_name: { type: String },
  room_password: { type: String },
  room_id: { type: String },
  messages: { type: [] },
  users: { type: [] },
  reports: { type: [] },
  bannedUsers: { type: [] },
});

const room = mongoose.model("Room", roomSchema);

module.exports = room;
