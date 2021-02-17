import { useState, useEffect } from "react";
import TOGGLE_REACT from "../graphql/toggleReact";
import GET_POST from "../graphql/getPost";
import { useMutation } from "@apollo/client";
import FEED_QUERY from "../graphql/feedQuery";

const ToggleReact = ({ post, loggedUser, isPostPage }) => {
    const { postReacts, postID } = post;
  const [clicked, setClicked] = useState(false);

  useEffect(() => {
    if (postReacts.find((react) => react.reactedBy === loggedUser.username)) {
      setClicked(true);
    } else {
      setClicked(false);
    }
  }, [post, postReacts]);

  const [toggleReact] = useMutation(TOGGLE_REACT, {
    variables: { postID },
    update(cache, result) {
      if (isPostPage) {
        const { getPost } = cache.readQuery({
          query: GET_POST,
          variables: { postID },
        });
        let newPostReacts = getPost.postReacts;
        if (
          getPost.postReacts.find(
            (react) => react.reactedBy === loggedUser.username
          )
        ) {
          newPostReacts = getPost.postReacts.filter(
            (react) => react.reactedBy !== loggedUser.username
          );
        } else {
          newPostReacts = [...newPostReacts, result.data.react];
        }
        const newPost = { ...getPost, postReacts: newPostReacts };
        cache.writeQuery({
          query: GET_POST,
          variables: { postID },
          data: {
            getPost: newPost,
          },
        });
      } else {
        const { getPosts } = cache.readQuery({
          query: FEED_QUERY,
        });
        const newFeed = getPosts.map((post) => {
          if (post.postID === result.data.react.postID) {
            let newPostReacts = post.postReacts;
            if (
              post.postReacts.find(
                (react) => react.reactedBy === loggedUser.username
              )
            ) {
              newPostReacts = post.postReacts.filter(
                (react) => react.reactedBy !== loggedUser.username
              );
            } else {
              newPostReacts = [...newPostReacts, result.data.react];
            }
            return { ...post, postReacts: newPostReacts };
          }
          return post;
        });
        cache.writeQuery({
          query: FEED_QUERY,
          data: {
            getPosts: newFeed,
          },
        });
      }
    },
  });
  return (
    <button
      type="button"
      onClick={toggleReact}
      className="rounded-lg border-2 px-2 border-gray-300"
      className={clicked ? "text-blue-300" : "text-gray-300"}
    >
      <i className="fas fa-thumbs-up"></i>
    </button>
  );
};

export default ToggleReact;
