import { useParams } from "react-router-dom";
import { useQuery } from "@apollo/client";
import GET_USER from "../graphql/getUser";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import FollowButton from "../components/FollowButton";

const User = () => {
    const { user } = useContext(AuthContext);
  const { username } = useParams();
  const { data } = useQuery(GET_USER, {
    variables: { username },
  });
  return (
    <>
      {data && (
        <div className="py-12 h-screen">
          <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-md">
            <div className="md:flex">
              <div className="w-full p-2 py-10">
                <div className="flex justify-center">
                  <div className="relative">
                    <img
                      src="https://i.pravatar.cc/300"
                      className="rounded-full"
                      width="80"
                    />
                  </div>
                </div>
                <div className="flex flex-col text-center mt-3 mb-4">
                  <span className="text-md text-gray-400">{data.getUser.username}</span>
                </div>
                <p className="px-16 text-center text-md text-gray-800">
                  {data.getUser.bio}
                </p>
                <div className="px-14 mt-5">
                  <button className="h-12 bg-gray-200 w-full text-black text-md rounded hover:shadow hover:bg-gray-300 mb-2">
                    Message
                  </button>
                    {data.getUser.username !== user.username && (
                        <FollowButton loggedUser={user} targetUser={data.getUser} />
                    )}
                  
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default User;
