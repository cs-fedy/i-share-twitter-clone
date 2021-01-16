const { Schema, model } = require("mongoose");

const postSchema = new Schema({
  username: String,
  postBody: String,
  postedAt: String,
  postUpdatedAt: String,
  commentsCount: {
    type: Number,
    default: 0
  },
  reactsCount: {
    type: Number,
    default: 0
  },
});

module.exports = model("post", postSchema);
