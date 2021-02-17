import { useState, useContext, useEffect } from "react";
import UpdatePost from "../components/UpdatePost";
import { AuthContext } from "../context/AuthContext";
import ToggleReact from "./ToggleReact";
import RemovePost from "./RemovePost";

const ReactionBar = ({ isPostPage, post }) => {
  const { postReacts, username, postComments, postID, postBody } = post;
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
              <div className="ml-3 inline-flex rounded-md shadow mr-2">
                <UpdatePost
                  postID={postID}
                  body={postBody}
                  isPostPage={isPostPage}
                />
              </div>
              <div className="inline-flex rounded-md shadow">
                <RemovePost isPostPage={isPostPage} postID={postID} />
              </div>
            </>
          )}
        </div>
      </div>
      <div className="ml-1 text-gray-500 dark:text-gray-400 font-light">
        {postComments.length > 1
          ? `${postComments.length} comments`
          : `${postComments.length} comment`}
      </div>
    </div>
  );
};

export default ReactionBar;
