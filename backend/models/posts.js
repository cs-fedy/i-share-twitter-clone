const { Schema, model } = require("mongoose");

const postSchema = new Schema({
  username: String,
  postBody: String,
  postedAt: String,
  postUpdatedAt: String,
  originalPostID: String,
});

module.exports = model("post", postSchema);
