import { useState, useEffect } from "react";
import { useMutation, useQuery } from "@apollo/client";
import TOGGLE_BOOKMARK from "../graphql/toggleBookmark";
import GET_BOOKMARKS from "../graphql/getBookmarks";

const BookmarkPost = ({ postID }) => {
  const [bookmarked, setBookmarked] = useState(false);
  const { data } = useQuery(GET_BOOKMARKS);
  useEffect(() => {
    if (
      data &&
      data.getBookmarks.find((bookmark) => bookmark.postID === postID)
    ) {
      setBookmarked(true);
    } else {
      setBookmarked(false);
    }
  }, [data]);

  const [toggleBookmark] = useMutation(TOGGLE_BOOKMARK);
  const bookmarkPost = () => {
    toggleBookmark({
      variables: { postID },
      update(cache, result) {
        const { getBookmarks } = cache.readQuery({
          query: GET_BOOKMARKS,
        });
        const exist = getBookmarks.find(
          (bookmark) => bookmark.postID === postID
        );
        let newBookmarks = getBookmarks;
        if (exist) {
          newBookmarks = newBookmarks.filter(
            (bookmark) => bookmark.postID !== postID
          );
        } else {
          newBookmarks = [...newBookmarks, result.data.toggleBookmark];
        }
        console.log(newBookmarks);
        cache.writeQuery({
          query: GET_BOOKMARKS,
          data: {
            getBookmarks: newBookmarks,
          },
        });
      },
    });
  };

  return (
    <button
      onClick={bookmarkPost}
      className="inline-flex items-center justify-center px-1 py-1 border border-transparent text-base font-medium rounded-md text-yellow-300 bg-white hover:bg-yellow-500 hover:text-white"
    >
      {bookmarked ? (
        <i className="fas fa-star"></i>
      ) : (
        <i className="far fa-star"></i>
      )}
    </button>
  );
};

export default BookmarkPost;
