const { Schema, model } = require("mongoose");

const messageSchema = new Schema({
  dmID: String,
  username: String,
  messageBody: String,
  sentAt: String,
});

module.exports = model("message", messageSchema);
