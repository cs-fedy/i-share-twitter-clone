const { Schema, model } = require('mongoose');

const commentSchema = new Schema({
    postID: String,
    commentedBy: String,
    commentBody: String,
    commentedAt: String,
    commentUpdatedAt: String
});

module.exports = model('comment', commentSchema);