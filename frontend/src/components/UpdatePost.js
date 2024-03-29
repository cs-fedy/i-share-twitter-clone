import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import UPDATE_POST from "../graphql/updatePost";
import FEED_QUERY from "../graphql/feedQuery";
import GET_POST from "../graphql/getPost";
import UPDATE_COMMENT from "../graphql/updateComment";

const UpdatePost = ({ postID, commentID, body, isPostPage, isComment }) => {
  const [data, setData] = useState({
    value: body,
    error: "",
  });

  const [hidden, setHidden] = useState(true);
  const toggleHidden = () => {
    setHidden(!hidden);
  };

  const handleChange = (element) => {
    setData({ ...data, value: element.target.value });
  };

  const [updatePost] = useMutation(UPDATE_POST, {
    onError(err) {
      setData({
        ...data,
        error: err.graphQLErrors[0].extensions.exception.errors.post,
      });
    },
  });

  const submitPost = (event) => {
    event.preventDefault();
    updatePost({
      variables: { postID, newPostBody: data.value },
      update(cache, result) {
        if (isPostPage) {
          const { getPost } = cache.readQuery({
            query: GET_POST,
            variables: { postID },
          });
          const newPost = {
            ...getPost,
            postBody: result.data.updatePost.postBody,
            postUpdatedAt: new Date().toISOString(),
          };

          cache.writeQuery({
            query: GET_POST,
            variables: { postID },
            data: {
              getPost: newPost,
            },
          });
        } else {
          const { getPosts: feed } = cache.readQuery({
            query: FEED_QUERY,
          });
          const newFeed = feed.map((post) => {
            if (post.postID === postID) {
              const { postBody, updatedAt } = result.data.updatePost;
              return { ...post, postBody, updatedAt };
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
    toggleHidden();
  };

  const [updateComment] = useMutation(UPDATE_COMMENT, {
    onError(err) {
      setData({
        ...data,
        error: err.graphQLErrors[0].extensions.exception.errors.comment,
      });
    },
  });
  const submitComment = (event) => {
    event.preventDefault();
    console.log(commentID, data.value);
    updateComment({
      variables: { commentID, newCommentBody: data.value },
      update(cache, result) {
        const { getPost } = cache.readQuery({
          query: GET_POST,
          variables: { postID },
        });

        const newComments = getPost.postComments.map((comment) => {
          if (comment.commentID === commentID) {
            return {
              ...comment,
              commentBody: result.data.updateComment.commentBody,
              commentUpdatedAt: result.data.updateComment.commentUpdatedAt,
            };
          }
          return comment;
        });
        const newPost = { ...getPost, postComments: newComments };
        console.log(newPost);
        cache.writeQuery({
          query: GET_POST,
          variables: { postID },
          data: {
            getPost: newPost,
          },
        });
      },
    });
    toggleHidden();
  };
  return (
    <React.Fragment>
      <button
        onClick={toggleHidden}
        className="inline-flex items-center justify-center px-1 py-1 border border-transparent text-base font-medium rounded-md text-green-700 bg-white hover:bg-green-700 hover:text-white"
      >
        <i className="fas fa-pen"></i>
      </button>
      {!hidden && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity"
              aria-hidden="true"
            >
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <form
              onSubmit={isComment ? submitComment : submitPost}
              className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
              role="dialog"
              aria-modal="true"
              aria-labelledby="modal-headline"
            >
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <textarea
                  className="description bg-gray-100 sec p-3 h-60 w-96 border border-gray-300 outline-none mb-3"
                  placeholder="Describe everything about this post here"
                  onChange={handleChange}
                  value={data.value}
                ></textarea>
                {data.error && (
                  <p classNameName="text-red-500 text-xs italic mb-1">
                    {data.error}
                  </p>
                )}
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="submit"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Update
                </button>
                <button
                  type="button"
                  onClick={toggleHidden}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </React.Fragment>
  );
};

export default UpdatePost;
