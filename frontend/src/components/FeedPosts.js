import { useQuery } from "@apollo/client";
import FeedPost from "./FeedPost";
import FEED_QUERY from "../graphql/feedQuery";
import NEW_POST_SUBSCRIPTION from "../graphql/newPostSub";
import { useMutation } from "@apollo/client";
import DELETE_POST from "../graphql/deletePost";

const FeedPosts = (props) => {
  const { data: queryData, subscribeToMore } = useQuery(FEED_QUERY);

  subscribeToMore({
    document: NEW_POST_SUBSCRIPTION,
    updateQuery: (prev, { subscriptionData }) => {
      if (!subscriptionData.data) return prev;
      const newPost = subscriptionData.data.postAdded;
      const exists = prev.getPosts.find(
        ({ postID }) => postID === newPost.postID
      );
      if (exists) {
        return prev;
      }

      const posts = Object.assign({}, prev, {
        getPosts: [...prev.getPosts, newPost],
      });
      return posts;
    },
  });

  const [deletePost] = useMutation(DELETE_POST);
  const removePost = (postID) => {
    deletePost({
      variables: { postID: postID },
      update(cache, result) {
        const { getPosts: feed } = cache.readQuery({
          query: FEED_QUERY,
        });
        const newFeed = feed.filter((post) => post.postID !== postID);
        cache.writeQuery({
          query: FEED_QUERY,
          data: {
            getPosts: newFeed,
          },
        });
      },
    });
  };

  return (
    <div className="grid grid-cols-3">
      {queryData &&
        queryData.getPosts.map((post) => (
          <FeedPost key={post.postID} {...post} removePost={removePost} />
        ))}
    </div>
  );
};

export default FeedPosts;
