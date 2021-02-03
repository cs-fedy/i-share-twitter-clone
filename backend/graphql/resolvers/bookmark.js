//* models
const Bookmark = require("../../models/bookmarks");
const Post = require("../../models/posts");
//* utils
const checkAuth = require("../../util/checkAuth");

module.exports = {
  Mutation: {
    //* TOGGLE_BOOKMARK: if a post exist in bookmarks list remove it else add it
    async toggleBookmark(parent, args, context, info) {
      //* Check if logged user has the right to toggle bookmarks or not
      const { username } = checkAuth(context);
      const { postID } = args;
      //* if the post doesn't exist throw an error
      const post = await Post.findById(postID);
      if (!post) {
        throw new Error("post does not exist");
      }
      //* if the post isn't bookmarked add it
      const bookmark = await Bookmark.findOne({ postID });
      if (!bookmark) {
        //* create, save and return the bookmark
        const newBookmark = new Bookmark({
          username,
          postID,
          bookmarkedAt: new Date().toISOString(),
        });
        const res = await newBookmark.save();
        return {
          ...res._doc,
          bookmarkID: res._id,
        };
      } else {
        //* remove the bookmark and return it
        await bookmark.remove();
        return {
          ...bookmark._doc,
          bookmarkID: bookmark._id,
        };
      }
    },
  },
};
