const { Schema, model } = require("mongoose");

const dmSchema = new Schema({
  messengers: [String],
  lastMessage: {
    type: Schema.Types.ObjectId,
    ref: "message",
  },
  startedDMSince: String,
  hidden: {
      type: Boolean,
      default: false
  }
});

module.exports = model("dms", dmSchema);
