import React, { useContext } from "react";
import { useHistory } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import CustomLink from "./CustomLink";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const history = useHistory();
  const handleClick = () => {
    history.push("/login");
    logout();
  };

  return (
    <div className="bg-blue-100 flex justify-center mb-5">
    <nav className="flex flex-wrap items-center justify-between p-5 md:container">
      <CustomLink to="/">I-share</CustomLink>
      <div className="flex gap-4">
        <CustomLink to="/user/:userID">
          {user.username}
        </CustomLink>
        <CustomLink to="#" role="button" onClick={handleClick}>
          logout
        </CustomLink>
      </div>
    </nav>
    </div>
  );
};

export default Navbar;
