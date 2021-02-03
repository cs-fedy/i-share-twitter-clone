import React, { useContext } from "react";
import { Route, Redirect } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export const LoggedRoutes = (props) => {
  const { component: Component, ...res } = props;
  const { isUserLogged } = useContext(AuthContext);
  return (
    <Route
      {...res}
      render={(props) =>
        isUserLogged ? <Component {...props} /> : <Redirect to="/login" />
      }
    />
  );
};

export const NotLoggedRoutes = (props) => {
  const { component: Component, ...res } = props;
  const { isUserLogged } = useContext(AuthContext);
  return (
    <Route
      {...res}
      render={(props) =>
        !isUserLogged ? <Component {...props} /> : <Redirect to="/" />
      }
    />
  );
};
