//* services
const BookmarkServices = require("../../services/bookmark");
const PostServices = require("../../services/post");
//* utils
const checkAuth = require("../../util/checkAuth");

module.exports = {
  Query: {
    //* GET_BOOKMARKS: get logged user saved bookmarks
    async getBookmarks(parent, args, context, info) {
      //* Check if logged user has the right to get the bookmarks or no
      const { username } = checkAuth(context);
      //* fetch and return bookmarks list if exist
      const bookmarks = await BookmarkServices.getUserBookmarks(username);
      return bookmarks.map((bookmark) => ({
        ...bookmark._doc,
        bookmarkID: bookmark._id,
      }));
    },
  },

  Mutation: {
    //* TOGGLE_BOOKMARK: if a post exist in bookmarks list remove it else add it
    async toggleBookmark(parent, args, context, info) {
      //* Check if logged user has the right to toggle bookmarks or not
      const { username } = checkAuth(context);
      const { postID } = args;
      //* if the post doesn't exist throw an error
      const post = await PostServices.getPost(postID);
      if (!post) {
        throw new Error("post does not exist");
      }
      //* if the post isn't bookmarked add it
      const bookmark = await BookmarkServices.getBookmark(postID, username);
      if (!bookmark) {
        //* create, save and return the bookmark
        const res = await BookmarkServices.createBookmark({
          username,
          postID,
          bookmarkedAt: new Date().toISOString(),
        });
        return {
          ...res._doc,
          bookmarkID: res._id,
        };
      } else {
        //* remove the bookmark and return it
        await BookmarkServices.removeBookmark(bookmark.bookmarkID);
        return {
          ...bookmark._doc,
          bookmarkID: bookmark._id,
        };
      }
    },
  },
};
