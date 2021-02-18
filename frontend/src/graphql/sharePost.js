import { gql } from "@apollo/client";

const SHARE_POST = gql`
    mutation sharePost($postID: ID!) {
        sharePost(postID: $postID) {
            postID
        }
    }
`;

export default SHARE_POST;