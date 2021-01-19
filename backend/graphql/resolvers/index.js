const userResolvers = require("./user");
const postResolvers = require("./post");
const bookmarkResolvers = require("./bookmark");
const dmResolvers = require("./directMessage");
const customResolvers = require("./customResolvers");

module.exports = {
  Query: {
    ...userResolvers.Query,
    ...postResolvers.Query,
    ...dmResolvers.Query,
  },

  Mutation: {
    ...userResolvers.Mutation,
    ...postResolvers.Mutation,
    ...bookmarkResolvers.Mutation,
    ...dmResolvers.Mutation,
  },

  ...customResolvers,
};
