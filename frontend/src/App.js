import React from "react"
import { BrowserRouter, Switch } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import { AuthProvider } from "./context/AuthContext";
import { LoggedRoutes, NotLoggedRoutes } from './components/PrivateRoute';
import Post from "./pages/Post";
import User from "./pages/User";

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Switch>
          <LoggedRoutes exact path="/" component={Home} />
          <LoggedRoutes path="/post/:postID" component={Post} />
          <LoggedRoutes path="/user/:username" component={User} />
          <NotLoggedRoutes path="/login" component={Login} />
          <NotLoggedRoutes path="/signup" component={Signup} />
        </Switch>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
