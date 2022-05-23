const { Schema, model } = require('mongoose');

const followSchema = new Schema({
    follower: String,
    following: String,
    followedAt: String
});

module.exports = model('follow', followSchema);