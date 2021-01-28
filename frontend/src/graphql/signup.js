import { gql } from "@apollo/client";

const REGISTER_USER = gql`
  mutation signup(
    $email: String!
    $username: String!
    $password: String!
    $confirmPassword: String!
  ) {
    signup(
      signupInput: {
        email: $email
        username: $username
        password: $password
        confirmPassword: $confirmPassword
      }
    ) {
      userID
      username
      token
    }
  }
`;

export default REGISTER_USER;
