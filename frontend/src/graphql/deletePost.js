import { gql } from "@apollo/client";

const DELETE_POST = gql`
  mutation deletePost($postID: ID!) {
    deletePost(postID: $postID)
  }
`;

export default DELETE_POST;
