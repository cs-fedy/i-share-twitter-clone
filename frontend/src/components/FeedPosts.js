import { useQuery } from "@apollo/client";
import FeedPost from "./FeedPost";
import FEED_QUERY from "../graphql/feedQuery";

const FeedPosts = (props) => {
  const { data: queryData } = useQuery(FEED_QUERY);

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
