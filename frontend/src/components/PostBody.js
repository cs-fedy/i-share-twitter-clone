import React from "react";
import PostDetails from "./PostDetails";
import ReactionBar from "./ReactionBar";

const PostBody = ({ post, seeMore, isPostPage }) => {
  return (
    <React.Fragment>
      <PostDetails post={post} seeMore={seeMore} />
      <ReactionBar post={post} isPostPage={isPostPage} />
    </React.Fragment>
  );
};

export default PostBody;
