//* global libraries
const { UserInputError } = require("apollo-server");
//* models
const Post = require("../../models/posts");
const User = require("../../models/users");
const Follow = require("../../models/follows");
const React = require("../../models/reacts");
const Comment = require("../../models/comments");
//* utils
const checkAuth = require("../../util/checkAuth");
module.exports = {
  Query: {
    //* GET_POSTS: get the posts of user followings(logged user is included): home screen posts
    async getPosts(parent, args, context, info) {
      //* Check if the user has the right to get posts or not
      const { username } = checkAuth(context);
      //* get the following of the logged user
      const follows = await Follow.find({ follower: username });
      const following = follows.map((follow) => follow.following);
      following.push(username);
      //* get followings posts
      const posts = following.map(
        async (currentUser) => await Post.find({ username: currentUser })
      );
      const result = await Promise.all(posts);
      //* return followings posts
      return result
        .flat()
        .reverse()
        .map((post) => ({
        ...post._doc,
        postID: post._id,
      }));
    },
    //* GET_POST: if the account of the owner of the post is public or followed by logged user return the post
    async getPost(parent, args, context, info) {
      //* Check if the user has the right to get x post or not
      const { username } = checkAuth(context);
      const { postID } = args;
      //* if the post doesn't exist throw an error
      const post = await Post.findById(postID);
      if (!post)
        throw new Error("post does not exist");
      //* if target user is logged user return the post
      if (username === post.username) {
        return {
          ...post._doc,
          postID: post._id,
        };
      } else {
        //* else if target user's account public or logged user is a follower return the user
        const { accountType } = await User.find({ username: post.username });
        const isTargetUserFollowed = await Follow.find({
          follower: username,
          following: post.username,
        });
        if (accountType === "public" || isTargetUserFollowed)
          return {
            ...post._doc,
            postID: post._id,
          };
        //* else throw an error
        throw new Error("you do not have the right to access this post");
      }
    },
  },

  Mutation: {
    //* CREATE_POST: create a new post
    async createPost(parent, args, context, info) {
      //* check if the user has the right to create a post or not
      const { username } = checkAuth(context);
      //* throw an error if input is invalid
      const { postBody } = args;
      if (!postBody.trim()) {
        throw new UserInputError("empty field", {
          errors: { post: "post body must not be empty" },
        });
      }
      //* create, save and return the new post
      const newPost = new Post({
        username,
        postBody,
        postedAt: new Date().toISOString(),
      });
      const res = await newPost.save();
      return {
        ...res._doc,
        postID: res._id,
      };
    },
    //* UPDATE_POST: update the post if it belongs to the logged user
    async updatePost(parent, args, context, info) {
      //* check if the user has the right to update the post or not
      const { username } = checkAuth(context);
      const {
        updatePostInput: { newPostBody, postID },
      } = args;
      //* if the post doesn't exist throw an error
      const post = await Post.findById(postID);
      if (!post) {
        throw new Error("post id not valid");
      }
      //* throw an error if the post doesn't belong to the logged user
      if (post.username !== username) {
        throw new Error(
          "you do not have any fucking right to update this post idiot"
        );
      }
      //* throw an error if input is invalid
      if (!newPostBody.trim()) {
        throw new UserInputError("empty field", {
          errors: { post: "post body must not be empty" },
        });
      }
      //* update and return the post
      const res = await Post.updateOne(
        { _id: postID },
        {
          postBody: newPostBody,
        }
      );
      return {
        ...post._doc,
        postID,
      };
    },
    //* DELETE_POST: delete the post if it belongs to the logged user
    async deletePost(parent, args, context, info) {
      //* check if the user has the right to delete the post or not
      const { username } = checkAuth(context);
      const { postID } = args;
      //* if the post doesn't exist throw an error
      const post = await Post.findById(postID);
      if (!post) {
        throw new Error("post id not valid");
      }
      //* throw an error if the post doesn't belong to the logged user
      if (post.username !== username) {
        throw new Error(
          "you do not have any fucking right to delete this post idiot"
        );
      }
      //* remove and return the post
      await Post.remove({ _id: postID });
      return postID;
    },
    //* REACT: if user already reacted on the post delete, else create new react
    async react(parent, args, context, info) {
      //* Check if the user has the right to react to the post or not
      const { username } = checkAuth(context);
      const {
        reactInput: { postID, reactType },
      } = args;
      //* if the post doesn't exist throw an error
      const post = await Post.findById(postID);
      if (!post) throw new Error("invalid post id");
      //* if logged user already reacted on the post remove the react
      const userReact = await React.findOne({ reactedBy: username, postID });
      if (userReact) {
        await userReact.remove();
        return {
          ...userReact._doc,
          reactID: userReact._id,
        };
      } else {
        //* else create, save and return the new react
        const newReact = new React({
          postID,
          reactedBy: username,
          reactType,
          reactedAt: new Date().toISOString(),
        });
        const res = await newReact.save();
        return {
          ...res._doc,
          reactID: res._id,
        };
      }
    },
    //* COMMENT: add comment ont a post
    async comment(parent, args, context, info) {
      //* Check if the user has the right to comment a post or not
      const { username } = checkAuth(context);
      const {
        commentInput: { commentBody, postID },
      } = args;
      //* if the post doesn't exist throw an error
      const post = await Post.findById(postID);
      if (!post) throw new Error("invalid post id");
      //* create, save and return new comment
      const newComment = new Comment({
        postID,
        commentedBy: username,
        commentBody,
        commentedAt: new Date().toISOString(),
      });
      const res = await newComment.save();
      return {
        ...res._doc,
        commentID: res._id,
      };
    },
    //* UPDATE_COMMENT: if the comment belong to the logged user update it
    async updateComment(parent, args, context, info) {
      //* Check if the user has the right to update a comment or not
      const { username } = checkAuth(context);
      const {
        updateCommentInput: { commentID, newCommentBody },
      } = args;
      //* if comment doesn't exist throw an error
      const comment = await Comment.findById(commentID);
      if (!comment) throw new Error("comment does not exist");
      //* if the comment doesn't belong to the logged user throw an error
      if (comment.commentedBy !== username) {
        throw new Error("this is not your comment");
      }
      //* update and return the comment
      comment.commentBody = newCommentBody;
      await Comment.updateOne({ _id: commentID }, comment);
      return {
        ...comment._doc,
        commentID: comment._id,
      };
    },
    //* DELETE_COMMENT: if the comment belong to the logged user delete it
    async deleteComment(parent, args, context, info) {
      //* Check if the user has the right to update a comment or not
      const { username } = checkAuth(context);
      const { commentID } = args;
      //* if comment doesn't exist throw an error
      const comment = await Comment.findById(commentID);
      if (!comment) {
        throw new Error("comment does not exist");
      }
      //* if comment doesn't belong to the logged user throw an error
      if (comment.commentedBy !== username) {
        throw new Error("this is not your comment");
      }
      //* remove the comment and return its id
      await comment.remove();
      return commentID;
    },
    //* SHARE_POST: share a post
    async sharePost(parent, args, context, info) {
      //* Check if the user has the right to share a post or not
      const { username } = checkAuth(context);
      const { postID } = args;
      //* if the post doesn't exist throw an error
      const post = await Post.findById(postID);
      if (!post) {
        throw new Error("post does not exist");
      }
      // TODO: check if the user is restricted to share the post or not
      //* create, save and return the shared post
      const newPost = new Post({
        username,
        postBody: post.postBody,
        postedAt: new Date().toISOString(),
        originalPostID: post._id,
      });
      const result = await newPost.save();
      return {
        ...result._doc,
        postID: result._id,
      };
    },
  },
};
