import { gql } from "@apollo/client";

const REMOVE_COMMENT = gql`
  mutation removeComment($commentID: ID!) {
    deleteComment(commentID: $commentID)
  }
`;

export default REMOVE_COMMENT;
