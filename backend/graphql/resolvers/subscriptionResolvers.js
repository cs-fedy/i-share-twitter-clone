module.exports = {
  postAdded: {
    // TODO: make sure user is a follower
    subscribe: (parent, args, context, info) => {
      const { pubsub } = context;
      return pubsub.asyncIterator(["POST_ADDED"]);
    },
    resolve: (payload) => payload,
  },
};
