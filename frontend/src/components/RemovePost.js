import { useMutation } from "@apollo/client";
import DELETE_POST from "../graphql/deletePost";
import FEED_QUERY from "../graphql/feedQuery";
import { useHistory } from "react-router-dom";
import REMOVE_COMMENT from "../graphql/removeComment";
import GET_POST from "../graphql/getPost";

const RemovePost = ({ postID, isPostPage, commentID }) => {
  const history = useHistory();
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
  const [deleteComment] = useMutation(REMOVE_COMMENT);
  const removeComment = () => {
    deleteComment({
      variables: { commentID },
      update(cache, result) {
        const { getPost } = cache.readQuery({
          query: GET_POST,
          variables: { postID },
        });
        let newPostComments = getPost.postComments.filter(
          (comment) => comment.commentID !== commentID
        );
        const newPost = { ...getPost, postComments: newPostComments };
        cache.writeQuery({
          query: GET_POST,
          variables: { postID },
          data: {
            getPost: newPost,
          },
        });
      },
    });
  };
  return (
    <button
      onClick={commentID ? removeComment : removePost}
      className="inline-flex items-center justify-center px-1 py-1 border border-transparent text-base font-medium rounded-md text-white bg-red-700 hover:bg-red-600"
    >
      <i className="fas fa-trash-alt"></i>
    </button>
  );
};

export default RemovePost;
