import { gql } from "@apollo/client";

const TOGGLE_FOLLOW = gql`
    mutation toggleFollow($targetUsername: String!) {
        toggleFollow(targetUsername: $targetUsername) {
            followID
            follower
            following
            followedAt
        }
    }
`;

export default TOGGLE_FOLLOW;
