import { Link } from "react-router-dom";

const HomeForLoggedOutUser = () => {
  return (
    <div className="w-screen h-screen md:container items-center justify-center flex-col flex">
      <Link
        to="/login"
        className="
        bg-blue-500 
        hover:bg-blue-700
        text-white 
          font-bold 
          py-2 
          px-4 
          mb-4 
          rounded 
          focus:outline-none 
          focus:shadow-outline"
      >
        Login
      </Link>
      <Link
        to="/login"
        className="
        bg-transparent 
      hover:bg-blue-500
      text-blue-700 
        font-semibold
      hover:text-white 
        py-2 
        px-4 
        border 
      border-blue-500 
        hover:border-transparent
        rounded"
      >
        Signup
      </Link>
    </div>
  );
};

export default HomeForLoggedOutUser;
