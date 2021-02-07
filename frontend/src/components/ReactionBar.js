import { useState, useContext } from "react";
import UpdatePost from "../components/UpdatePost";
import { AuthContext } from "../context/AuthContext";
import { useMutation } from "@apollo/client";
import DELETE_POST from "../graphql/deletePost";
import FEED_QUERY from "../graphql/feedQuery";

const ReactionBar = ({
  postReacts,
  username,
  postComments,
  postID,
  postBody,
}) => {
  const [hidden, setHidden] = useState(true);
  const { user: loggedUser } = useContext(AuthContext);

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
  };

  return (
    <>
      <div className="flex justify-between items-center mt-5">
        <div className="flex ">
          <span className="ml-1 text-gray-500 dark:text-gray-400  font-light">
            {postReacts.length > 1
              ? `${postReacts.length} likes`
              : `${postReacts.length} like`}
          </span>
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
                   className="inline-flex items-center justify-center px-1 py-1 border border-transparent text-base font-medium rounded-md text-white bg-red-700 hover:bg-red-600">
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
        />
      )}
    </>
  );
};

export default ReactionBar;
