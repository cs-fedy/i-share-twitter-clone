import PostDetails from "./PostDetails";
import ReactionBar from "./ReactionBar";

const PostBody = ({ post, seeMore, isPostPage }) => {
  return (
    <>
      <PostDetails post={post} seeMore={seeMore} />
      <ReactionBar post={post} isPostPage={isPostPage} />
    </>
  );
};

export default PostBody;
