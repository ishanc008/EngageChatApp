const mongoose = require("mongoose");

const url = process.env.ATLAS_URL;

const connect = mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const connection = mongoose.connection;
connection.once("open", () => console.log("Database connected"));

module.exports = connect;
