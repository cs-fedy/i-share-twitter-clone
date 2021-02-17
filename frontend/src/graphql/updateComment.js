import { gql } from "@apollo/client";

const UPDATE_COMMENT = gql`
  mutation updateComment($commentID: ID!, $newCommentBody: String!) {
    updateComment(
        updateCommentInput: {
        commentID: $commentID
        newCommentBody: $newCommentBody
      }
    ) {
      commentID
      commentedBy
      commentBody
      commentedAt
      commentUpdatedAt
      postID
    }
  }
`;


export default UPDATE_COMMENT;