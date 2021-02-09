import moment from "moment";
import { Link } from "react-router-dom";

const PostDetails = ({
  username,
  postUpdatedAt,
  postedAt,
  postBody,
  postID,
  seeMore,
}) => {
  return (
    <>
      <div className="flex justify-between flex-row">
        <div className="flex mb-4">
          <img
            className="w-12 h-12 rounded-full"
            src="https://i.pravatar.cc/300"
            alt=""
          />
          <div className="ml-2 mt-0.5">
            <span className="block font-medium text-base leading-snug text-black dark:text-gray-100">
              {username}
            </span>
            <span className="block text-sm text-gray-500 dark:text-gray-400 font-light leading-snug">
              {postUpdatedAt
                ? moment(postUpdatedAt).fromNow()
                : moment(postedAt).fromNow()}
            </span>
          </div>
        </div>
      </div>
      <p className="text-gray-800 dark:text-gray-100 leading-snug md:leading-normal">
        {postBody}
        {seeMore && (
          <Link className="underline ml-3" to={`/post/${postID}`}>
            See post details
          </Link>
        )}
      </p>
    </>
  );
};

export default PostDetails;
