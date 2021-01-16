const { Schema, model } = require('mongoose');

const blockSchema = new Schema({
    blocker: String,
    blocking: String,
    blockedAt: String
});

module.exports = model('block', blockSchema);