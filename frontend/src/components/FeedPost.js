import PostBody from "./PostBody";

const FeedPost = (props) => {
  return (
    <div className="p-8 dark:bg-gray-900 flex items-center justify-center mt-4">
      <div className="px-5 py-4 bg-white dark:bg-gray-800 shadow rounded-lg w-96">
        <PostBody seeMore={true} {...props} />
      </div>
    </div>
  );
};

export default FeedPost;
