import React, { useContext } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const AuthRoute = (props) => {
    const { component: Component, ...res } = props;
    const { isUserLogged } = useContext(AuthContext);
    return <Route {...res} render={
        props => isUserLogged? <Redirect to="/" />: <Component {...props} />
    } />
}

export default AuthRoute;