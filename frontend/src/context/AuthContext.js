import React, { createContext, useReducer } from "react";
import jwtDecode from "jwt-decode";

const initialState = {
    user: null
};

const token = localStorage.getItem("JWT_TOKEN");
if (token) {
    const decodedToken = jwtDecode(token);
    if (decodedToken.exp * 1000 < Date.now()) {
        localStorage.removeItem("JWT_TOKEN");
    } else {
        initialState.user = decodedToken;
    }
}

const AuthContext = createContext({
  user: null,
  login: (data) => {},
  logout: () => {},
});

const authReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      return {
        ...state,
        user: action.payload,
      };
    case "LOGOUT":
      return {
        ...state,
        user: null,
      };
    default:
      return state;
  }
};

const AuthProvider = (props) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const login = (data) => {
    localStorage.setItem("JWT_TOKEN", data.token);
    dispatch({
      type: "LOGIN",
      payload: data,
    });
  };

  const logout = () => {
    localStorage.removeItem("JWT_TOKEN");
    dispatch({
        type: "LOGOUT",
    });
  };

  return (
    <AuthContext.Provider value={{ login, logout, user: state.user }}>
      {props.children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
