import { useParams } from "react-router-dom";
import { useQuery } from "@apollo/client";
import Navbar from "../components/Navbar";
import GET_POST from "../graphql/getPost";
import PostBody from "../components/PostBody";
import { useState } from "react";
import CommentSection from "../components/CommentSection";

const Post = (props) => {
  const [error, setError] = useState(false);
  const { postID } = useParams();
  const { data } = useQuery(GET_POST, {
    variables: { postID },
    onError(err) {
      setError(true);
    },
  });

  const redirectToHome = () => {
    props.history.push("/");
  };

  if (error) {
    return (
      <div className="w-screen h-screen flex justify-center items-center flex-col">
        <h1 className="block text-gray-700 text-lg font-bold mb-3">
          post doesn't exist
        </h1>
        <button
          onClick={redirectToHome}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 mr-2 rounded focus:outline-none focus:shadow-outline"
        >
          return to home
        </button>
      </div>
    );
  }
  return (
    <>
      <Navbar />
      {data && (
        <main>
          <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <div className="px-4 py-6 sm:px-0">
              <div className="border-4 border-dashed border-gray-200 rounded-lg px-8 py-4">
                <PostBody
                  seeMore={false}
                  isPostPage={true}
                  post={data.getPost}
                />
                <CommentSection
                  comments={data.getPost.postComments}
                  postID={data.getPost.postID}
                />
              </div>
            </div>
          </div>
        </main>
      )}
    </>
  );
};

export default Post;
