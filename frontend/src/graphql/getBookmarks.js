import { gql } from "@apollo/client";

const GET_BOOKMARKS = gql`
  {
    getBookmarks {
      postID
      bookmarkID
      username
      bookmarkedAt
    }
  }
`;

export default GET_BOOKMARKS;
