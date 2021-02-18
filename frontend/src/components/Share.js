import { useMutation } from "@apollo/client";
import SHARE_POST from "../graphql/sharePost";
import GET_POST from "../graphql/getPost";

const Share = ({ postID, isPostPage }) => {
  const [share] = useMutation(SHARE_POST);
  const sharePost = () => {
    share({
      variables: { postID },
      update(cache, result) {
        if (isPostPage) {
          const { getPost } = cache.readQuery({
            query: GET_POST,
            variables: { postID },
          });

          const newPostReposts = [...getPost.reposts, result.data.sharePost];
          const newPost = { ...getPost, reposts: newPostReposts };

          cache.writeQuery({
            query: GET_POST,
            variables: { postID },
            data: {
              getPost: newPost,
            },
          });
        }
      },
    });
  };

  return (
    <button
      onClick={sharePost}
      className="inline-flex items-center justify-center px-1 py-1 border border-transparent text-base font-medium rounded-md text-yellow-300 bg-white hover:bg-yellow-500 hover:text-white"
    >
      <i className="fas fa-share"></i>
    </button>
  );
};

export default Share;
