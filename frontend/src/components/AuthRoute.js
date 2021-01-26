import React, { useContext } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const AuthRoute = (props) => {
    const { component: Component, ...res } = props;
    const { user } = useContext(AuthContext);
    // TODO: fix redirecting when user is logged and current page is home
    return <Route {...res} render={
        props => user? <Redirect to="/" />: <Component {...props} />
    } />
}

export default AuthRoute;