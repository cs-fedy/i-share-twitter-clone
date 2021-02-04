import { gql } from "@apollo/client";

const FEED_QUERY = gql`
  {
    getPosts {
      postID
      username
      postBody
      postedAt
      postUpdatedAt
      originalPostID
      postReacts {
        reactID
      }
      postComments {
        commentID
      }
    }
  }
`;

export default FEED_QUERY;
