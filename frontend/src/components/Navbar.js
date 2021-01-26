import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Navbar = (props) => {
  const { user, logout } = useContext(AuthContext);
  const handleClick = () => {
    // TODO: fix logging out issues
    // props.history.push("/login");
    logout();
  };

  return (
    <nav className="flex flex-wrap items-center justify-between p-5 bg-blue-200">
      <Link to="/">I-share</Link>
      <div>
        <Link to="/user/:userID" className="mr-4">
          {user.username}
        </Link>
        <Link to="#" role="button" onClick={handleClick}>
          logout
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
