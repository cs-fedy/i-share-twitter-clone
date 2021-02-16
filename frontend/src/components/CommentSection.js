import CommentsForm from "./CommentsForm";
import Comments from "./Comments";

const CommentSection = ({ comments, postID }) => {
    return (
        <div className="flex flex-col">
            <CommentsForm postID={postID} />
            <Comments comments={comments} />

        </div>
    );
}

export default CommentSection;