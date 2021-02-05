import { useContext, useState } from "react";
import moment from "moment";
import { AuthContext } from "../context/AuthContext";
import UpdatePost from "../components/UpdatePost";

const FeedPost = ({ removePost, ...rest }) => {
  const [hidden, setHidden] = useState(true);
  const { user: loggedUser } = useContext(AuthContext);
  const toggleHidden = () => {
    setHidden(!hidden);
  };

  return (
    <>
      <div className="p-8 dark:bg-gray-900 flex items-center justify-center mt-4">
        <div className="px-5 py-4 bg-white dark:bg-gray-800 shadow rounded-lg w-96">
          <div className="flex justify-between flex-row">
            <div className="flex mb-4">
              <img
                className="w-12 h-12 rounded-full"
                src="https://i.pravatar.cc/300"
                alt=""
              />
              <div className="ml-2 mt-0.5">
                <span className="block font-medium text-base leading-snug text-black dark:text-gray-100">
                  {rest.username}
                </span>
                <span className="block text-sm text-gray-500 dark:text-gray-400 font-light leading-snug">
                  {rest.updatedAt
                    ? moment(rest.updatedAt).format("DD/MM/YYYY")
                    : moment(rest.createdAt).format("DD/MM/YYYY")}
                </span>
              </div>
            </div>
          </div>
          <p className="text-gray-800 dark:text-gray-100 leading-snug md:leading-normal">
            {rest.postBody}
          </p>
          <div className="flex justify-between items-center mt-5">
            <div className="flex ">
              <span className="ml-1 text-gray-500 dark:text-gray-400  font-light">
                {rest.postReacts.length > 1
                  ? `${rest.postReacts.length} likes`
                  : `${rest.postReacts.length} like`}
              </span>
              <div className="flex flex-row">
                {rest.username === loggedUser.username && (
                  <>
                    <div className="ml-3 inline-flex rounded-md shadow mr-2">
                      <button
                        onClick={toggleHidden}
                        className="inline-flex items-center justify-center px-1 py-1 border border-transparent text-base font-medium rounded-md text-green-700 bg-white hover:bg-green-700 hover:text-white"
                      >
                        <i className="fas fa-pen"></i>
                      </button>
                    </div>
                    <div className="inline-flex rounded-md shadow">
                      <button
                        className="inline-flex items-center justify-center px-1 py-1 border border-transparent text-base font-medium rounded-md text-white bg-red-700 hover:bg-red-600"
                        onClick={removePost.bind(this, rest.postID)}
                      >
                        <i className="fas fa-trash-alt"></i>
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
            <div className="ml-1 text-gray-500 dark:text-gray-400 font-light">
              {rest.postComments.length > 1
                ? `${rest.postComments.length} comments`
                : `${rest.postComments.length} comment`}
            </div>
          </div>
        </div>
      </div>
      {!hidden && (
        <UpdatePost
          toggleHidden={toggleHidden}
          postID={rest.postID}
          postBody={rest.postBody}
        />
      )}
    </>
  );
};

export default FeedPost;
