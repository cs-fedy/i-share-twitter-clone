import { gql } from "@apollo/client";

const LOG_USER = gql`
  mutation login($username: String!, $password: String!) {
    login(loginInput: { username: $username, password: $password }) {
      userID
      username
      token
    }
  }
`;

export default LOG_USER;
