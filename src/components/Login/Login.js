import FlatButton from 'material-ui/FlatButton';
import React from 'react';
import {Component} from 'react';
import {NavLink} from 'react-router-dom';

const styleButton = {
    color: "#fffff",
}

export class Login extends Component {
    static muiName = 'FlatButton';

    render() {
        return (
            <NavLink to="/login">
                <FlatButton {...this.props} label="Login" style={styleButton}/>
            </NavLink>
        );
    }
}