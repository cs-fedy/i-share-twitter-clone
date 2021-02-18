import { useState, useContext, useEffect } from "react";
import UpdatePost from "../components/UpdatePost";
import { AuthContext } from "../context/AuthContext";
import ToggleReact from "./ToggleReact";
import RemovePost from "./RemovePost";
import Share from "./Share";
import BookmarkPost from "./BookmarkPost";

const ReactionBar = ({ isPostPage, post }) => {
  const {
    postReacts,
    username,
    postComments,
    postID,
    postBody,
    reposts,
  } = post;
  const { user: loggedUser } = useContext(AuthContext);

  return (
    <div className="flex justify-between items-center mt-5">
      <div className="flex ">
        <div className="flex items-center">
          <span className="ml-1 text-gray-500 dark:text-gray-400 font-light mr-2">
            {postReacts.length > 1
              ? `${postReacts.length} likes`
              : `${postReacts.length} like`}
          </span>
          <ToggleReact
            post={post}
            loggedUser={loggedUser}
            isPostPage={isPostPage}
          />
        </div>
        <div className="flex flex-row">
          {username === loggedUser.username && (
            <>
              <div className="ml-3 inline-flex rounded-md shadow">
                <UpdatePost
                  postID={postID}
                  body={postBody}
                  isPostPage={isPostPage}
                />
              </div>
              <div className="ml-3 inline-flex rounded-md shadow">
                <RemovePost isPostPage={isPostPage} postID={postID} />
              </div>
            </>
          )}
          <div className="ml-3 inline-flex rounded-md shadow">
            <Share postID={postID} isPostPage={isPostPage} />
          </div>
          <div className="ml-3 inline-flex rounded-md shadow">
            <BookmarkPost postID={postID} />
          </div>
        </div>
      </div>
      <div className="flex flex-col ml-1 text-gray-500 dark:text-gray-400 font-light">
        <p>
          {postComments.length > 1
            ? `${postComments.length} comments`
            : `${postComments.length} comment`}
        </p>
        <p>
          {reposts.length > 1
            ? `${reposts.length} shares`
            : `${reposts.length} share`}
        </p>
      </div>
    </div>
  );
};

export default ReactionBar;
