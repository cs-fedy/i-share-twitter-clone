import Input from "./Input";
import { React, useState } from "react";
import { useMutation } from "@apollo/client";
import ADD_COMMENT from "../graphql/addComment";
import GET_POST from "../graphql/getPost";

const CommentsForm = ({ postID }) => {
  const [commentData, setCommentData] = useState({
    value: "",
    error: "",
  });

  const [addComment] = useMutation(ADD_COMMENT, {
    variables: { commentBody: commentData.value, postID },
    update(cache, result) {
      setCommentData({ ...commentData, value: "" });
      const { getPost } = cache.readQuery({
        query: GET_POST,
        variables: { postID },
      });

      const newPostComments = [...getPost.postComments, result.data.comment];
      const newPost = { ...getPost, postComments: newPostComments };

      cache.writeQuery({
        query: GET_POST,
        variables: { postID },
        data: {
          getPost: newPost,
        },
      });
    },
    onError(err) {
      setCommentData({
        ...commentData,
        error: err.graphQLErrors[0].extensions.exception.errors.comment,
      });
    },
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    addComment();
  };

  const handleChange = (element) => {
    setCommentData({ ...commentData, value: element.target.value });
  };

  return (
    <div className="flex flex-col mb-4">
      <h3 className="block text-gray-700 text-md font-bold">Comments:</h3>
      <form className="flex" onSubmit={handleSubmit}>
        <div className="flex flex-col">
        <Input
          type="text"
          aria-label="Your comment..."
          handleChange={handleChange}
          value={commentData.value}
          error={commentData.error}
        />
        </div>
        <button
          type="submit"
          className="btn border border-indigo-500 p-1 px-4 font-semibold cursor-pointer text-gray-200 ml-2 bg-indigo-500"
        >
          comment
        </button>
      </form>
    </div>
  );
};

export default CommentsForm;
