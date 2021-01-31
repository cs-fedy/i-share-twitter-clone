import { React, useState } from "react";
import { useMutation } from "@apollo/client";
import ADD_POST from "../graphql/addPost";
import FEED_QUERY from "../graphql/feedQuery";

const AddPost = (props) => {
  const [postData, setPostData] = useState({
    value: "",
    error: "",
  });

  const [addPost] = useMutation(ADD_POST, {
    onError(err) {
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

  return (
    <div className="w-screen items-center justify-center flex">
      <form
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-96"
        onSubmit={handleSubmit}
        noValidate
      >
        <textarea
          onChange={handleChange}
          className="form-textarea mt-1 block w-full mb-1"
          value={postData.value}
          rows="3"
          placeholder="Your post here..."
        ></textarea>
        {postData.error && (
          <p className="text-red-500 text-xs italic mb-1">{postData.error}</p>
        )}
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 mr-2 rounded focus:outline-none focus:shadow-outline">
          Add post
        </button>
      </form>
    </div>
  );
};

export default AddPost;
