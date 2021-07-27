//* global libraries
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { UserInputError } = require("apollo-server");
//* utils
const {
  validateSignupInput,
  validateSignInInput,
} = require("../../util/validator");
const checkAuth = require("../../util/checkAuth");
//* env vars
const jwtSecret = process.env.jwtSecret;
//* services
const userService = require("../../services/user");
const followService = require("../../services/follow");

module.exports = {
  Query: {
    //* GET_USER: get x user data
    async getUser(parent, args, context, info) {
      //* check if user has the right to get a user or not
      const authUser = checkAuth(context);
      const { username } = args;
      //* throw an error if the target user doesn't exist
      const user = await userService.getUser(username);
      if (!user) throw new Error("user does not exist");
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
      const user = await userService.getUser(username);
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
      const alreadyRegistered = await userService.getUser(username);
      if (alreadyRegistered) {
        throw new UserInputError("username is taken", {
          errors: { username: "username is taken" },
        });
      }
      //* hash the password and save the new user in the db
      const hashedPassword = await bcrypt.hash(password, 12);
      const newUser = await userService.createUser({
        email,
        password: hashedPassword,
        username,
        accountCreatedAt: new Date().toISOString(),
        accountType: "public",
      });

      //* sign a new jwt and return the new user
      const token = await jwt.sign(
        { userID: newUser._id, username },
        jwtSecret,
        {
          expiresIn: "2h",
        }
      );
      return {
        ...newUser._doc,
        userID: newUser._id,
        token,
      };
    },

    //* TOGGLE_FOLLOW: if user is following the target user remove the follow, else create a new follow
    async toggleFollow(parent, args, context, info) {
      //* check if user has the right to toggle follow or not
      const { username } = checkAuth(context);
      const { targetUsername } = args;
      //* get the follow from the db
      const follow = await followService.getFollow(username, targetUsername);
      if (follow) {
        //* remove and return the follow if it exist
        await followService.removeFollow(follow._id);
        return {
          ...follow._doc,
          followID: follow._id,
        };
      } else {
        //* create and return the new follow
        const newFollow = followService.createFollow(username, targetUsername);
        return {
          ...newFollow._doc,
          followID: newFollow._id,
        };
      }
    },
  },
};
