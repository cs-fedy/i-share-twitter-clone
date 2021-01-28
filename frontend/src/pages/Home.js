import React, { useContext } from "react";
import Navbar from "../components/Navbar";
import { AuthContext } from "../context/AuthContext";
import AddPost from "../components/AddPost";
import FeedPosts from "../components/FeedPosts";

const Home = () => {
  const { isUserLogged } = useContext(AuthContext);
  if (isUserLogged) {
    return (
      <div>
        <Navbar />
        <AddPost />
        <FeedPosts />
      </div>
    );
  }
};

export default Home;
