import { gql } from "@apollo/client";

const ADD_POST = gql`
  mutation createPost($postBody: String!) {
    createPost(postBody: $postBody) {
      postID
      username
      postBody
      postedAt
      postUpdatedAt
      originalPostID
    }
  }
`;

export default ADD_POST;
