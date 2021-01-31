import { useQuery } from "@apollo/client";
import FeedPost from "./FeedPost";
import FEED_QUERY from "../graphql/feedQuery";
import NEW_POST_SUBSCRIPTION from "../graphql/newPostSub";

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

  return (
    <div>
      {queryData &&
        queryData.getPosts.map(({ postID, ...rest }) => (
          <FeedPost key={postID} {...rest} />
        ))}
    </div>
  );
};

export default FeedPosts;
