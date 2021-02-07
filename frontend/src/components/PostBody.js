import PostDetails from "./PostDetails";
import ReactionBar from "./ReactionBar";

const PostBody = (props) => {
  return (
    <>
      <PostDetails {...props} />
      <ReactionBar {...props} />
    </>
  );
};

export default PostBody;
