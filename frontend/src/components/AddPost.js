import { React, useState } from "react";
import { useMutation } from "@apollo/client";
import ADD_POST from "../graphql/addPost";
import FEED_QUERY from "../graphql/feedQuery";

const AddPost = () => {
  const [postData, setPostData] = useState({
    value: "",
    error: "",
  });

  const [addPost] = useMutation(ADD_POST, {
    onError(err) {
      console.log(err);
      setPostData({
        ...postData,
        error: err.graphQLErrors[0].extensions.exception.errors.post,
      });
    },
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    addPost({
      variables: { postBody: postData.value },
      update(cache, result) {
        setPostData({ ...postData, value: "" });
        const { getPosts: feed } = cache.readQuery({
          query: FEED_QUERY,
        });
        const newPost = result.data.createPost;
        const exists = feed.find(({ postID }) => postID === newPost.postID);
        let newFeed = feed;
        if (!exists) {
          newFeed = [...feed, newPost];
        }
        cache.writeQuery({
          query: FEED_QUERY,
          data: {
            getPosts: newFeed,
          },
        });
      },
    });
  };

  const handleChange = (element) => {
    setPostData({ ...postData, value: element.target.value });
  };

  const handleCancel = (event) => {
    event.preventDefault();
    setPostData({ value: "", error: "" });
  };

  return (
    <div>
      <form
        className="editor mx-auto w-10/12 flex flex-col text-gray-800 border border-gray-300 p-4 shadow-lg max-w-2xl"
        onSubmit={handleSubmit}
      >
        <textarea
          className="description bg-gray-100 sec p-3 h-60 border border-gray-300 outline-none mb-3"
          placeholder="Describe everything about this post here"
          onChange={handleChange}
          value={postData.value}
        ></textarea>
        {postData.error && (
          <p className="text-red-500 text-xs italic mb-1">{postData.error}</p>
        )}
        <div className="buttons flex">
          <button
            type="button"
            onClick={handleCancel}
            className="btn border border-gray-300 p-1 px-4 font-semibold cursor-pointer text-gray-500 ml-auto"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn border border-indigo-500 p-1 px-4 font-semibold cursor-pointer text-gray-200 ml-2 bg-indigo-500"
          >
            Post
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddPost;
