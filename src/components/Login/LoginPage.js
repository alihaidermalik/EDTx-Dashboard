import CircularProgress from 'material-ui/CircularProgress';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import React from 'react';
import {connect} from 'react-redux';

import {userActions} from '../../actions';

class LoginPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            username: '',
            password: '',
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(e) {
        const {name, value} = e.target;
        this.setState({[name]: value});
    }

    handleSubmit(e) {
        e.preventDefault();

        this.setState({submitted: true});
        const {username, password} = this.state;
        const {dispatch} = this.props;
        if (username && password) {
            dispatch(userActions.login(username, password));
        }


    }

    render() {
        const {loggingIn} = this.props;
        const {username, password} = this.state;
        return (
            <div style={{display: "flex", justifyContent: "center"}}>
                <br/>
                <Paper className={"edtx-paper"} style={{ zDepth: 2 }}>
                    <h2>Login</h2>
                    <form name="form" onSubmit={this.handleSubmit} autocomplete="off"
                          style={{display: "flex", flexDirection: "column", justifyContent: "center"}}>

                        <TextField
                            hintText="Enter your Username"
                            defaultValue={username}
                            floatingLabelText="Username"
                            onChange={(event, newValue) => this.setState({username: newValue})}
                        />
                        <br/>
                        <TextField
                            type="password"
                            hintText="Enter your Password"
                            defaultValue={password}
                            floatingLabelText="Password"
                            onChange={(event, newValue) => this.setState({password: newValue})}
                        />
                        <br/>
                        {loggingIn ?
                            <div style={{position: 'relative'}}>
                                <CircularProgress size={60} thickness={7} style={{marginLeft: '50%', left: -30}}/>
                            </div> :
                            <RaisedButton label="Submit"
                                          style={style}
                                          backgroundColor={'#364D7C'}
                                          labelColor='#fff'
                                          type="submit"
                            />
                        }
                    </form>
                </Paper>
            </div>
        );
    }
}

const style = {
    margin: 15,
};

function mapStateToProps(state) {
    const {loggingIn} = state.authentication;
    return {
        loggingIn
    };
}

const connectedLoginPage = connect(mapStateToProps)(LoginPage);
export {connectedLoginPage as LoginPage};
