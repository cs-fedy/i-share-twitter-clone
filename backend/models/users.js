const { Schema, model } = require('mongoose');

const userSchema = new Schema({
    email: String,
    password: String,
    username: String,
    accountCreatedAt: String,
    accountType: String,
    bio: String,
    gender: String,
    profilePictureURL: String,
    country: String,
    birthDate: String
});

module.exports = model('user', userSchema);