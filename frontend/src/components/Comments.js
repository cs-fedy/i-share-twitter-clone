import Comment from "./Comment";

const Comments = ({ comments }) => {
  return (
    <>
      {comments.map((comment) => (
        <Comment key={comment.commentID} comment={comment} />
      ))}
    </>
  );
};

export default Comments;
