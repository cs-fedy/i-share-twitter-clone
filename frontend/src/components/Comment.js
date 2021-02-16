import moment from "moment";

const Comment = ({ comment }) => {
  const { commentedBy, commentUpdatedAt, commentedAt, commentBody } = comment;
  return (
    <div className="flex flex-row gap-1 mb-2">
      <div className="flex mb-4">
        <img
          className="w-12 h-12 rounded-full"
          src="https://i.pravatar.cc/300"
          alt=""
        />
        <div className="ml-2 mt-0.5">
          <span className="block font-medium text-base leading-snug text-black dark:text-gray-100">
            {commentedBy}
          </span>
          <span className="block text-sm text-gray-500 dark:text-gray-400 font-light leading-snug">
            {commentUpdatedAt
              ? moment(commentUpdatedAt).fromNow()
              : moment(commentedAt).fromNow()}
          </span>
        </div>
      </div>
      <p>{commentBody}</p>
    </div>
  );
};

export default Comment;
