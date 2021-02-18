import { gql } from "@apollo/client";

const TOGGLE_BOOKMARK = gql`
  mutation toggleBookmark($postID: ID!) {
    toggleBookmark(postID: $postID) {
      bookmarkID
      username
      postID
      bookmarkedAt
    }
  }
`;

export default TOGGLE_BOOKMARK;
