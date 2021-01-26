import React, { createContext, useState } from "react";
import jwtDecode from "jwt-decode";

let initialState = {
  user: null,
  isUserLogged: false,
};

const token = localStorage.getItem("JWT_TOKEN");
if (token) {
  const decodedToken = jwtDecode(token);
  if (decodedToken.exp * 1000 < Date.now()) {
    localStorage.removeItem("JWT_TOKEN");
  } else {
    initialState = {
      user: decodedToken,
      isUserLogged: true,
    };
  }
}

const AuthContext = createContext({
  user: null,
  login: (data) => {},
  logout: () => {},
  isUserLogged: false,
});

const AuthProvider = (props) => {
  const [authDetails, setAuthDetails] = useState(initialState);

  const login = (data) => {
    localStorage.setItem("JWT_TOKEN", data.token);
    setAuthDetails((prevState) => ({
      ...prevState,
      user: data,
      isUserLogged: true,
    }));
  };

  const logout = () => {
    localStorage.removeItem("JWT_TOKEN");
    setAuthDetails((prevState) => ({
      ...prevState,
      isUserLogged: false,
      user: null,
    }));
  };

  return (
    <AuthContext.Provider
      value={{
        login,
        logout,
        user: authDetails.user,
        isUserLogged: authDetails.isUserLogged,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
