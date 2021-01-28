const FeedPost = (props) => {
  return (
      <div>
          {props.postBody} - { props.username}
      </div>
  );
};

export default FeedPost;
