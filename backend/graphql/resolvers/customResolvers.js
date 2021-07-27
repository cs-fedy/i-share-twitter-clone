//* services
const PostService = require("../../services/post");
const BookmarkService = require("../../services/bookmark");
const FollowService = require("../../services/follow");
const ReactService = require("../../services/react");
const CommentService = require("../../services/comment");
const DMService = require("../../services/dm");

module.exports = {
  user: {
    userPosts: async (parent) => {
      const result = await PostService.getPost(parent.username);
      return result.map((post) => ({ ...post._doc, postID: post._id }));
    },
    userBookmarks: async (parent) => {
      const result = await BookmarkService.getUserBookmarks(parent.username);
      return result.map((bookmark) => ({
        ...bookmark._doc,
        bookmarkID: bookmark._id,
      }));
    },
    userFollowings: async (parent) => {
      const result = await FollowService.getUserFollowings(parent.username);
      return result.map((follow) => ({
        ...follow._doc,
        followID: follow._id,
      }));
    },
    userFollowers: async (parent) => {
      const result = await FollowService.getUserFollowers(parent.username);
      return result.map((follow) => ({
        ...follow._doc,
        followID: follow._id,
      }));
    },
  },

  post: {
    postReacts: async (parent) => {
      const result = await ReactService.getPostReacts(parent.postID);
      return result
        .filter((react) => !react.hidden)
        .map((react) => ({ ...react._doc, reactID: react._id }));
    },
    postComments: async (parent) => {
      const result = await CommentService.getPostComments(parent.postID);
      return result
        .filter((comment) => !comment.hidden)
        .map((comment) => ({ ...comment._doc, commentID: comment._id }));
    },
    reposts: async (parent) => {
      const result = await PostService.getRetweets(parent.postID);
      return result.map((post) => ({ ...post._doc, postID: post._id }));
    },
  },
  dm: {
    lastMessage: async (parent) => {
      const messages = await DMService.getFirstMessage(parent.dmID);
      const lastMessage = messages[messages.length - 1];
      return {
        ...lastMessage._doc,
        messageID: lastMessage._id,
      };
    },
  },
};
