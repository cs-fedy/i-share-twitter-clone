module.exports = {
  postAdded: {
    subscribe: (parent, args, context, info) => {
      const { pubsub } = context;
      return pubsub.asyncIterator(["POST_ADDED"]);
    },
    resolve: (payload) => payload,
  },
};
