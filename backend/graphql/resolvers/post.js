//* global libraries
const { UserInputError } = require("apollo-server");
//* utils
const checkAuth = require("../../util/checkAuth");
//* services
const FollowService = require("../../services/follow");
const PostService = require("../../services/post");
const UserService = require("../../services/user");
const ReactService = require("../../services/react");
const CommentService = require("../../services/comment");

module.exports = {
  Query: {
    //* GET_POSTS: get the posts of user followings(logged user is included): home screen posts
    async getPosts(parent, args, context, info) {
      //* Check if the user has the right to get posts or not
      const { username } = checkAuth(context);
      //* get the following of the logged user
      const follows = await FollowService.get({ follower: username });

      const following = follows.map((follow) => follow.following);
      following.push(username);
      //* get followings posts
      const posts = following.map(
        async (currentUser) => await PostService.getUserPosts(currentUser)
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
      const post = await PostService.getPost(postID);
      if (!post) throw new Error("post does not exist");
      //* if target user is logged user return the post
      if (username === post.username) {
        return {
          ...post._doc,
          postID: post._id,
        };
      } else {
        //* else if target user's account public or logged user is a follower return the user
        const { accountType } = await UserService.getUser(post.username);
        const isTargetUserFollowed = await FollowService.getFollow(
          username,
          post.username
        );
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
      //* create, save, publish and return the new post
      const res = await PostService.createPost({
        username,
        postBody,
        postedAt: new Date().toISOString(),
      });

      const returnedPost = {
        ...res._doc,
        postID: res._id,
      };
      context.pubsub.publish("POST_ADDED", returnedPost);
      return returnedPost;
    },

    //* UPDATE_POST: update the post if it belongs to the logged user
    async updatePost(parent, args, context, info) {
      //* check if the user has the right to update the post or not
      const { username } = checkAuth(context);
      const {
        updatePostInput: { newPostBody, postID },
      } = args;
      //* if the post doesn't exist throw an error
      const post = await PostService.getPost(postID);
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
      const res = await PostService.updatePost(postID, newPostBody);
      return {
        ...post._doc,
        postBody: newPostBody,
        postID,
      };
    },

    //* DELETE_POST: delete the post if it belongs to the logged user
    async deletePost(parent, args, context, info) {
      //* check if the user has the right to delete the post or not
      const { username } = checkAuth(context);
      const { postID } = args;
      //* if the post doesn't exist throw an error
      const post = await PostService.getPost(postID);
      if (!post) {
        throw new Error("post id not valid");
      }
      //* throw an error if the post doesn't belong to the logged user
      if (post.username !== username) {
        throw new Error(
          "you do not have any fucking right to delete this post idiot"
        );
      }
      //* remove post reacts and comments
      await ReactService.clearReacts(postID);
      await CommentService.clearComments(postID);
      // TODO: remove chared posts
      //* remove and return the post
      await PostService.removePost(postID);
      return postID;
    },

    //* REACT: if user already reacted on the post delete, else create new react
    async react(parent, args, context, info) {
      //* Check if the user has the right to react to the post or not
      const { username } = checkAuth(context);
      const { postID } = args;
      //* if the post doesn't exist throw an error
      const post = await PostService.getPost(postID);
      if (!post) throw new Error("invalid post id");
      //* if logged user already reacted on the post remove the react
      const userReact = await ReactService.getReact(username, postID);
      if (userReact) {
        await ReactService.removeReact(userReact._id);
        return {
          ...userReact._doc,
          reactID: userReact._id,
        };
      } else {
        //* else create, save and return the new react
        const res = await ReactService.createReact({
          postID,
          reactedBy: username,
          reactedAt: new Date().toISOString(),
        });
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
      //* throw an error if input is invalid
      const {
        commentInput: { commentBody, postID },
      } = args;
      if (!commentBody.trim()) {
        throw new UserInputError("empty field", {
          errors: { comment: "comment body must not be empty" },
        });
      }
      //* if the post doesn't exist throw an error
      const post = await PostService.getPost(postID);
      if (!post) throw new Error("invalid post id");
      //* create, save and return new comment
      const res = await CommentService.createComment({
        postID,
        commentedBy: username,
        commentBody,
        commentedAt: new Date().toISOString(),
      });
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
      const comment = await CommentService.getComment(commentID);
      if (!comment) throw new Error("comment does not exist");
      //* throw an error if input is invalid

      if (!newCommentBody.trim()) {
        throw new UserInputError("empty field", {
          errors: { comment: "comment body must not be empty" },
        });
      }
      //* if the comment doesn't belong to the logged user throw an error
      if (comment.commentedBy !== username) {
        throw new Error("this is not your comment");
      }
      //* update and return the comment
      const res = await CommentService.updateComment(commentID, {
        ...comment,
        commentBody: newCommentBody,
        commentUpdatedAt: new Date().toISOString(),
      });
      console.log(res);
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
      const comment = await CommentService.getComment(commentID);
      if (!comment) {
        throw new Error("comment does not exist");
      }
      //* if comment doesn't belong to the logged user throw an error
      if (comment.commentedBy !== username) {
        throw new Error("this is not your comment");
      }
      //* remove the comment and return its id
      await CommentService.removeComment(comment._id);
      return commentID;
    },

    //* SHARE_POST: share a post
    async sharePost(parent, args, context, info) {
      //* Check if the user has the right to share a post or not
      const { username } = checkAuth(context);
      const { postID } = args;
      //* if the post doesn't exist throw an error
      const post = await PostService.getPost(postID);
      if (!post) {
        throw new Error("post does not exist");
      }
      //* if the target user isn't the logged user do:
      const targetUser = await UserService.getUser(post.username);
      if (targetUser.username !== username) {
        //* throw an error if the logged user is restricted to share the post
        const isFollower = await FollowService.getFollow(
          username,
          targetUsername
        );
        if (!isFollower && targetUser.accountType === "private")
          throw new Error("follow first to share the post");
      }
      //* create, save, publish and return the shared post
      const result = await PostService.createPost({
        username,
        postBody: post.postBody,
        postedAt: new Date().toISOString(),
        originalPostID: post._id,
      });

      const returnedPost = {
        ...result._doc,
        postID: result._id,
      };
      context.pubsub.publish("POST_ADDED", returnedPost);
      return returnedPost;
    },
  },
};
