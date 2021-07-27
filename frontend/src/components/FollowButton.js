import React, { useState, useEffect } from "react";
import { useMutation } from "@apollo/client";
import TOGGLE_FOLLOW from "../graphql/toggleFollow";
import GET_USER from "../graphql/getUser";

const FollowButton = ({ loggedUser, targetUser }) => {
  const [status, setStatus] = useState("following");
  useEffect(() => {
    if (targetUser.userFollowers) {
      if (
        targetUser.userFollowers.find(
          (follow) => follow.follower === loggedUser.username
        )
      ) {
        setStatus("following");
      } else {
        setStatus("follow");
      }
    }
  }, [targetUser]);

  const [toggleFollow] = useMutation(TOGGLE_FOLLOW);
  const handleFollow = () => {
    toggleFollow({
      variables: { targetUsername: targetUser.username },
      update: (cache, result) => {
        const { getUser } = cache.readQuery({
          query: GET_USER,
          variables: { username: targetUser.username },
        });
        const exist = getUser.userFollowers.find(
          (follow) => follow.follower === loggedUser.username
        );
        let newFollowers = getUser.userFollowers;
        if (exist) {
          newFollowers = newFollowers.filter(
            (follow) => follow.follower !== loggedUser.username
          );
        } else {
          const { followID, follower, followedAt } = result.data.toggleFollow;
          const newFollow = {
            followID,
            follower,
            followedAt,
          };
          newFollowers = [...newFollowers, newFollow];
        }
        const newUser = { ...getUser, userFollowers: newFollowers };
        console.log(newUser);
        cache.writeQuery({
          query: GET_USER,
          variables: { username: targetUser.username },
          data: {
            getUser: newUser,
          },
        });
      },
    });
  };

  return (
    <button
      onClick={handleFollow}
      className="h-12 bg-blue-700 w-full text-white text-md rounded hover:shadow hover:bg-blue-800"
    >
      {status}
    </button>
  );
};

export default FollowButton;
