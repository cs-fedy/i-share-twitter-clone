const CommentModel = require("../models/comments");

class Comment {
  async clearComments(postID) {
    return await CommentModel.remove({ postID });
  }

  async createComment(data) {
    return await CommentModel.create(data);
  }

  async getComment(commentID) {
    return await CommentModel.findById(commentID);
  }

  async updateComment(commentID, data) {
    return await CommentModel.findByIdAndUpdate(commentID, data);
  }

  async removeComment(commentID) {
    return await CommentModel.findByIdAndDelete(commentID);
  }

  async getPostComments(postID) {
    return await CommentModelComment.find({ postID });
  }
}

module.exports = new Comment();
