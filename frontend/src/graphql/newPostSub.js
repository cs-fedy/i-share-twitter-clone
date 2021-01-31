const { gql } = require("@apollo/client");

const NEW_POST_SUBSCRIPTION = gql`
  subscription {
    postAdded {
      postID
      username
      postBody
      postedAt
      postUpdatedAt
      originalPostID
    }
  }
`;

export default NEW_POST_SUBSCRIPTION;
