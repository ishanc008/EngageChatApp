const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const messageSchema = new Schema({
  name: { type: String, required: true },
  text: { type: String, required: true },
  user_id: { type: String },
  createdAt: {
    type: Date,
    default: new Date(),
  },
  likes: {
    type: [String],
    default: [],
  },
});

const message = mongoose.model("Message", messageSchema);

module.exports = message;
