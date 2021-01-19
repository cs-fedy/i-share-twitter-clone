const { Schema, model } = require('mongoose');

const reactSchema = new Schema({
    postID: String,
    reactedBy: String,
    reactBody: String,
    reactType: String,
    reactedAt: String,
});

module.exports = model('react', reactSchema);