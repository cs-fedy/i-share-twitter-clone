//* global libraries
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { UserInputError } = require("apollo-server");
//* Models
const User = require("../../models/users");
const Follow = require("../../models/follows");
const DM = require("../../models/directMessages");
const Comment = require("../../models/comments");
const React = require("../../models/reacts");
const Post = require("../../models/posts");
const Message = require("../../models/messages");
const Bookmark = require("../../models/bookmarks");
//* utils
const {
  validateSignupInput,
  validateSignInInput,
} = require("../../util/validator");
const checkAuth = require("../../util/checkAuth");
//* env vars
const jwtSecret = process.env.jwtSecret;

module.exports = {
  Query: {
    //* GET_USER: get x user data
    async getUser(parent, args, context, info) {
      //* check if user has the right to get a user or not
      const authUser = checkAuth(context);
      const { userID } = args;
      //* throw an error if the target user doesn't exist
      const user = await User.findById(userID);
      if (!user) {
        throw new Error("user does not exist");
      }
      //* else return the target user
      return {
        ...user._doc,
        userID: user._id,
      };
    },
  },

  Mutation: {
    //* LOGIN: log the user
    async login(parent, args, context, info) {
      const {
        loginInput: { username, password },
      } = args;
      //* throw an error if user input is invalid
      const { errors, valid } = validateSignInInput(username, password);
      if (!valid) {
        throw new UserInputError("invalid credentials", { errors });
      }
      //* throw an error if the user doesn't exist
      const user = await User.findOne({ username });
      if (!user) {
        throw new UserInputError("invalid username", {
          errors: { username: "user does not exist" },
        });
      }
      //* throw an error if the password is invalid
      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        errors.general = "Wrong credentials";
        throw new UserInputError("Wrong credentials", { errors });
      }
      //* sign a new jwt and return the logged user
      const token = await jwt.sign({ userID: user._id, username }, jwtSecret, {
        expiresIn: "2h",
      });
      return {
        ...user._doc,
        userID: user._id,
        token,
      };
    },
    //* SIGNUP: register a new user
    async signup(parent, args, context, info) {
      const {
        signupInput: { email, username, password, confirmPassword },
      } = args;
      //* throw an error if user input is invalid
      const { errors, valid } = validateSignupInput(
        email,
        username,
        password,
        confirmPassword
      );
      if (!valid) {
        throw new UserInputError("invalid credentials", { errors });
      }
      //* throw an error if new user is already registered
      const alreadyRegistered = await User.findOne({ username });
      if (alreadyRegistered) {
        throw new UserInputError("username is taken", {
          errors: { username: "username is taken" },
        });
      }
      //* hash the password and save the new user in the db
      const hashedPassword = await bcrypt.hash(password, 12);
      const newUser = new User({
        email,
        password: hashedPassword,
        username,
        accountCreatedAt: new Date().toISOString(),
        accountType: "public",
      });
      const res = await newUser.save();
      //* sign a new jwt and return the new user
      const token = await jwt.sign({ userID: res._id, username }, jwtSecret, {
        expiresIn: "2h",
      });
      return {
        ...res._doc,
        userID: res._id,
        token,
      };
    },
    //* DELETE_ACCOUNT: delete user account
    // TODO: refactor and test deleteAccount
    async deleteAccount(parent, args, context, info) {
      //* check if user has the right to delete his own account or not
      const { userID } = checkAuth(context);
      const { username } = await User.findById(userID);
      if (!username)
        throw new Error("user does not exist");
      //* remove the user from 'follow', 'comment', 'react', 'post', 'message', 'dm' and 'bookmark' list
      await Follow.remove(
        ({ follower, following }) => [follower, following].indexOf(username) > 0
      );
      await Comment.remove({ commentedBy: username });
      await React.remove({ reactedBy: username });
      await Post.remove({ username });
      await Message.remove({ username });
      await Bookmark.remove({ username });
      await DM.remove(
        ({ messengers }) =>
          messengers.length === 2 && messengers.indexOf(username) > 0
      );
      const dms = await DM.find(
        ({ messengers }) => messengers.indexOf(username) > 0
      );
      const filteredDMs = dms.map(async (dm) => {
        dm.messengers.filter((messenger) => messenger !== username);
        await dm.update();
      });
      await Promise.resolveAll(filteredDMs);
      //* remove the user and return his id
      await user.remove();
      return userID;
    },
    //* TOGGLE_FOLLOW: if user is following the target user remove the follow, else create a new follow
    async toggleFollow(parent, args, context, info) {
      //* check if user has the right to toggle follow or not
      const { username } = checkAuth(context);
      const { targetUsername } = args;
      //* get the follow from the db
      const follow = await Follow.findOne({
        follower: username,
        following: targetUsername,
      });
      if (follow) {
        //* remove and return the follow if it exist
        await follow.remove();
        return {
          ...follow._doc,
          followID: follow._id,
        };
      } else {
        //* if no dm between the two messengers, create new one
        const messengers = [targetUsername, username];
        const dmAlreadyExist = await DM.find();
        dmAlreadyExist.filter(
          (dm) => dm.messengers.sort() === messengers.sort()
        );
        if (dmAlreadyExist.length === 0) {
          const newDM = new DM({
            messengers,
            startedDMSince: new Date().toISOString(),
          });
          await newDM.save();
        }
        //* else create and return the new follow
        const newFollow = new Follow({
          follower: username,
          following: targetUsername,
          followedAt: new Date().toISOString(),
        });
        const result = await newFollow.save();
        return {
          ...result._doc,
          followID: result._id,
        };
      }
    },
  },
};
