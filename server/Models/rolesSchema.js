const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const rolesSchema = new Schema({
  name: { type: String },
  adminPerms: { type: Boolean },
  modPerms: { type: Boolean },
});

const role = mongoose.model("Role", rolesSchema);

module.exports = role;
