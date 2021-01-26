import React, { useContext } from "react";
import Navbar from "../components/Navbar";
import { AuthContext } from "../context/AuthContext";
import HomeForLoggedOutUser from "../components/HomeForLoggedOutUser";

const Home = () => {
  const { isUserLogged } = useContext(AuthContext);
  if (!isUserLogged) {
    return <HomeForLoggedOutUser />;
  }
  return (
    <div>
      <Navbar />
    </div>
  );
};

export default Home;
