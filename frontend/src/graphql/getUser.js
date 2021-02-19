import { gql } from "@apollo/client";

const GET_USER = gql`
  query getUser($username: String!) {
    getUser(username: $username) {
      userID
      email
      username
      accountCreatedAt
      accountType
      bio
      accountUpdatedAt
      gender
      profilePictURL
      country
      birthDate
      userPosts {
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
        }
        reposts {
          postID
        }
      }
      userBookmarks {
        bookmarkID
        username
        postID
        bookmarkedAt
      }
      userFollowings {
        followID
        following
        followedAt
      }
      userFollowers {
        followID
        follower
        followedAt
      }
    }
  }
`;

export default GET_USER;
