const PostModel = require("../models/posts");

class Post {
  async getUserPosts(username) {
    return await PostModel.find({ username });
  }

  async getPost(postID) {
    return await PostModel.findById(postID);
  }

  async createPost(postData) {
    return await PostModel.create(postData);
  }

  async updatePost(postID, newPostBody) {
    return await PostModel.updateOne(
      { _id: postID },
      {
        postBody: newPostBody,
        postUpdatedAt: new Date().toISOString(),
      }
    );
  }

  async removePost(postID) {
    return await PostModel.findByIdAndRemove(postID);
  }

  async getRetweets(postID) {
    return await PostModel.find({ originalPostID: postID });
  }
}

module.exports = new Post();
