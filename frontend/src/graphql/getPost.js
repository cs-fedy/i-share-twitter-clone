import { gql } from "@apollo/client";

const GET_POST = gql`
  query getPost($postID: ID!) {
    getPost(postID: $postID) {
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
        commentedBy
        commentBody
        commentedAt
        commentUpdatedAt
      }
    }
  }
`;

export default GET_POST;
