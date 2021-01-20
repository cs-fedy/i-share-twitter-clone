const { Schema, model } = require("mongoose");

const dmSchema = new Schema({
  messengerOne: String,
  messengerTwo: String,
  startedDMSince: String,
  lastMessage: {
    type: Schema.Types.ObjectId,
    ref: 'message'
  }
});

module.exports = model("dms", dmSchema);
