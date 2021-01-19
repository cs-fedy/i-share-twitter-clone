const { Schema, model } = require("mongoose");

const dmSchema = new Schema({
  messengers: [String],
  startedDMSince: String,
  hidden: {
      type: Boolean,
      default: false
  }
});

module.exports = model("dms", dmSchema);
