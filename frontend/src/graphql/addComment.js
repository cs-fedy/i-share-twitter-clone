import { gql } from "@apollo/client";

const ADD_COMMENT = gql`
  mutation addComment($commentBody: String!, $postID: ID!) {
    comment(commentInput: { commentBody: $commentBody, postID: $postID }) {
      commentID
      commentedBy
      commentBody
      commentedAt
      commentUpdatedAt
      postID
    }
  }
`;

export default ADD_COMMENT;