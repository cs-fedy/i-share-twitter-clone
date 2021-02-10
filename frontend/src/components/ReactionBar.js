import { useState, useContext, useEffect } from "react";
import UpdatePost from "../components/UpdatePost";
import { AuthContext } from "../context/AuthContext";
import { useMutation } from "@apollo/client";
import DELETE_POST from "../graphql/deletePost";
import FEED_QUERY from "../graphql/feedQuery";
import { useHistory } from "react-router-dom";
import TOGGLE_REACT from "../graphql/toggleReact";
import GET_POST from "../graphql/getPost";

const ReactionBar = ({ isPostPage, post }) => {
  const { postReacts, username, postComments, postID, postBody } = post;
  const [hidden, setHidden] = useState(true);
  const [clicked, setClicked] = useState(false);
  const { user: loggedUser } = useContext(AuthContext);
  const history = useHistory();
  useEffect(() => {
    if (postReacts.find((react) => react.reactedBy === loggedUser.username)) {
      setClicked(true);
    } else {
      setClicked(false);
    }
  }, [post, postReacts]);

  const toggleHidden = () => {
    setHidden(!hidden);
  };

  const [deletePost] = useMutation(DELETE_POST);
  const removePost = () => {
    deletePost({
      variables: { postID: postID },
      update(cache, result) {
        const { getPosts: feed } = cache.readQuery({
          query: FEED_QUERY,
        });
        const newFeed = feed.filter((post) => post.postID !== postID);
        cache.writeQuery({
          query: FEED_QUERY,
          data: {
            getPosts: newFeed,
          },
        });
      },
    });
    if (isPostPage) {
      history.push("/");
    }
  };

  const [toggleReaction] = useMutation(TOGGLE_REACT, {
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
  const toggleReact = () => {
    toggleReaction();
  };

  return (
    <>
      <div className="flex justify-between items-center mt-5">
        <div className="flex ">
          <div className="flex items-center">
            <span className="ml-1 text-gray-500 dark:text-gray-400 font-light mr-2">
              {postReacts.length > 1
                ? `${postReacts.length} likes`
                : `${postReacts.length} like`}
            </span>
            <button
              type="button"
              onClick={toggleReact}
              className="rounded-lg border-2 px-2 border-gray-300"
              className={clicked ? "text-blue-300" : "text-gray-300"}
            >
              <i className="fas fa-thumbs-up"></i>
            </button>
          </div>
          <div className="flex flex-row">
            {username === loggedUser.username && (
              <>
                <div className="ml-3 inline-flex rounded-md shadow mr-2">
                  <button
                    onClick={toggleHidden}
                    className="inline-flex items-center justify-center px-1 py-1 border border-transparent text-base font-medium rounded-md text-green-700 bg-white hover:bg-green-700 hover:text-white"
                  >
                    <i className="fas fa-pen"></i>
                  </button>
                </div>
                <div className="inline-flex rounded-md shadow">
                  <button
                    onClick={removePost}
                    className="inline-flex items-center justify-center px-1 py-1 border border-transparent text-base font-medium rounded-md text-white bg-red-700 hover:bg-red-600"
                  >
                    <i className="fas fa-trash-alt"></i>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
        <div className="ml-1 text-gray-500 dark:text-gray-400 font-light">
          {postComments.length > 1
            ? `${postComments.length} comments`
            : `${postComments.length} comment`}
        </div>
      </div>
      {!hidden && (
        <UpdatePost
          toggleHidden={toggleHidden}
          postID={postID}
          postBody={postBody}
          isPostPage={isPostPage}
        />
      )}
    </>
  );
};

export default ReactionBar;
