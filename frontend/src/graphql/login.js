import { gql } from "@apollo/client";

const LOG_USER = gql`
mutation login($username:String!, $password: String!) {
  login(loginInput: { username:$username, password: $password}) {
    userID
    username
    token
    userBookmarks {
      postID
    }
  }
}
`;

export default LOG_USER;
