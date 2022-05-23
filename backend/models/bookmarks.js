const { Schema, model } = require('mongoose');

const bookmarkSchema = new Schema({
    username: String,
    postID: String,
    bookmarkedAt: String
});

module.exports = model('bookmarks', bookmarkSchema);