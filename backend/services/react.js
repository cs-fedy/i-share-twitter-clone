const ReactModel = require("../models/reacts");

class React {
  async clearReacts(postID) {
    return await ReactModel.remove({ postID });
  }

  async getReact(reactedBy, postID) {
    return await ReactModel.findOne({ reactedBy, postID });
  }

  async removeReact(reactID) {
    return await ReactModel.findByIdAndRemove(reactID);
  }

  async createReact(react) {
    return await ReactModel.create(react);
  }

  async getPostReacts(postID) {
    return await ReactModel.find({ postID });
  }
}

module.exports = new React();
