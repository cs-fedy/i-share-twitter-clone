const BookmarksModel = require("../models/bookmarks");

class Bookmark {
  async getUserBookmarks(username) {
    return await BookmarksModel.find({ username });
  }

  async getUserBookmarks(username) {
    return await BookmarksModel.find({ username });
  }

  async getBookmark(postID, username) {
    return await BookmarksModel.findOne({ postID, username });
  }

  async createBookmark(data) {
    return await BookmarksModel.create(data);
  }

  async removeBookmark(bookmarkID) {
    return await BookmarksModel.findByIdAndDelete(bookmarkID);
  }
}

module.exports = new Bookmark();
