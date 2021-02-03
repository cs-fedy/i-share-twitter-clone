const { ApolloServer, PubSub } = require("apollo-server");
const mongoose = require("mongoose");

require("dotenv").config();
const port = process.env.PORT;
const dbURI = process.env.dbURI;

const pubsub = new PubSub();

const typeDefs = require("./graphql/typeDefs");
const resolvers = require("./graphql/resolvers");
const server = new ApolloServer(
  {
    typeDefs,
    resolvers,
    context: ({ req }) => {
      return { req, pubsub };
    },
  },
  { debug: false }
);

mongoose
  .connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("successfully connected to db");
    return server.listen(port);
  })
  .then((res) => console.log(`server is on: ${res.url}`))
  .catch((err) => {
    throw new Error(err);
  });
