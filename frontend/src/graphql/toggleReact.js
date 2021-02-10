import { gql } from "@apollo/client";

const TOGGLE_REACT = gql`
  mutation($postID: ID!) {
    react(postID: $postID) {
      reactID
      postID
      reactedBy
      reactedAt
    }
  }
`;

export default TOGGLE_REACT;