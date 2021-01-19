//* models
const Post = require("../../models/posts");
const Bookmark = require("../../models/bookmarks");
const Follow = require("../../models/bookmarks");
const React = require("../../models/reacts");
const Comment = require("../../models/comments");

module.exports = {
  user: {
    userPosts: async (parent) => {
      const result = await Post.find({ username: parent.username });
      return result.map((post) => ({ ...post._doc, postID: post._id }));
    },
    userBookmarks: async (parent) => {
      const result = await Bookmark.find({ username: parent.username });
      return result.map((bookmark) => ({
        ...bookmark._doc,
        bookmarkID: bookmark._id,
      }));
    },
    userFollowings: async (parent) => {
      const result = await Follow.find({ follower: parent.username });
      return result.map((follow) => ({
        ...follow._doc,
        followID: follow._id,
      }));
    },
    userFollowers: async (parent) => {
      const result = await Follow.find({ following: parent.username });
      return result.map((follow) => ({
        ...follow._doc,
        followID: follow._id,
      }));
    },
  },

  post: {
    postReacts: async (parent) => {
      const result = await React.find({ postID: parent.postID });
      return result
        .filter((react) => !react.hidden)
        .map((react) => ({ ...react._doc, reactID: react._id }));
    },
    postComments: async (parent) => {
      const result = await Comment.find({ postID: parent.postID });
      return result
        .filter((comment) => !comment.hidden)
        .map((comment) => ({ ...comment._doc, commentID: comment._id }));
    },
  },
};
