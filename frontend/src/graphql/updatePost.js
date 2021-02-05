import { gql } from "@apollo/client";

const UPDATE_POST = gql`
  mutation updatePost($postID: ID!, $newPostBody: String!) {
    updatePost(
      updatePostInput: { postID: $postID, newPostBody: $newPostBody }
    ) {
      postID
      postBody
    }
  }
`;

export default UPDATE_POST;
