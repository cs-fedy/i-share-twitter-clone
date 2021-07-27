import moment from "moment";
import React from "react";
import CustomLink from "./CustomLink";

const PostDetails = ({ post, seeMore }) => {
  const {
    username,
    postUpdatedAt,
    postedAt,
    postBody,
    postID,
    originalPostID,
  } = post;
  return (
    <React.Fragment>
      <div className="flex justify-between flex-row">
        <div className="flex mb-4 justify-between w-full">
          <div className="flex flex-row">
          <img
            className="w-12 h-12 rounded-full"
            src="https://i.pravatar.cc/300"
            alt=""
          />
          <div className="ml-2 mt-0.5">
            <CustomLink href={`/user/${username}`}>
              {username}
            </CustomLink>
            <span className="block text-sm text-gray-500 dark:text-gray-400 font-light leading-snug">
              {postUpdatedAt
                ? moment(postUpdatedAt).fromNow()
                : moment(postedAt).fromNow()}
            </span>
          </div>
          </div>
          {originalPostID && (
            <a className="underline" href={`/post/${originalPostID}`}>
              See original post
            </a>
          )}
        </div>
      </div>
      <p className="text-gray-800 dark:text-gray-100 leading-snug md:leading-normal">
        {postBody}
        {seeMore && (
          <a className="underline ml-3" href={`/post/${postID}`}>
            See post details
          </a>
        )}
      </p>
    </React.Fragment>
  );
};

export default PostDetails;
