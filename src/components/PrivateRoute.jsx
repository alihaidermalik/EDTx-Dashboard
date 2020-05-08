import React from 'react';
import {Redirect, Route} from 'react-router-dom';

export const PrivateRoute = ({component: Component, type: Type, ...rest}) => (
    <Route {...rest} render={props => (
        localStorage.getItem('user')
            ? <Component {...props} Type={Type}/>
            : <Redirect to={{pathname: '/login', state: {from: props.location}}}/>
    )}/>
)