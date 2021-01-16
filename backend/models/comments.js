const { Schema, model } = require('mongoose');

const commentSchema = new Schema({
    postID: String,
    commentedBy: String,
    commentBody: String,
    commentedAt: String,
    commentUpdatedAt: String,
    hidden: {
        type: Boolean,
        default: false
    }
});

module.exports = model('comment', commentSchema);