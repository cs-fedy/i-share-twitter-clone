const userResolvers = require("./user");
const postResolvers = require("./post");
const bookmarkResolvers = require("./bookmark");
const dmResolvers = require("./directMessage");
const customResolvers = require("./customResolvers");
const subscriptionResolvers = require("./subscriptionResolvers");
module.exports = {
  Query: {
    ...userResolvers.Query,
    ...postResolvers.Query,
    ...bookmarkResolvers.Query,
    ...dmResolvers.Query,
  },

  Mutation: {
    ...userResolvers.Mutation,
    ...postResolvers.Mutation,
    ...bookmarkResolvers.Mutation,
    ...dmResolvers.Mutation,
  },

  Subscription: {
    ...subscriptionResolvers,
  },

  ...customResolvers,
};
