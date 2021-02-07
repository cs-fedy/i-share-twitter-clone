import { useParams } from "react-router-dom";
import { useQuery } from "@apollo/client";
import Navbar from "../components/Navbar";
import GET_POST from "../graphql/getPost";
import PostBody from "../components/PostBody";

const Post = () => {
  const { postID } = useParams();
  const { data } = useQuery(GET_POST, {
    variables: { postID },
  });

  return (
    <>
      <Navbar />
      {data && (
        <main>
          <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <div class="px-4 py-6 sm:px-0">
              <div class="border-4 border-dashed border-gray-200 rounded-lg px-8 py-4">
                <PostBody seeMore={false} {...data.getPost} />
              </div>
            </div>
          </div>
        </main>
      )}
    </>
  );
};

export default Post;
