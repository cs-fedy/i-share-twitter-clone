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
        reactedBy
      }
      postComments {
        commentID
      }
      reposts {
        postID
      }
    }
  }
`;

export default FEED_QUERY;
