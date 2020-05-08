import Divider from 'material-ui/Divider';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import UserIcon from 'material-ui/svg-icons/action/account-circle';
import ExitIcon from 'material-ui/svg-icons/action/exit-to-app';
import FeedbackIcon from 'material-ui/svg-icons/action/feedback';
import HelpIcon from 'material-ui/svg-icons/action/help';
import SettingsIcon from 'material-ui/svg-icons/action/settings';
import NotificationsIcon from 'material-ui/svg-icons/social/notifications';
import {Component} from 'react';
import React from 'react';
import {connect} from 'react-redux';
import {NavLink} from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import { Dropdown, DropdownButton, Container, Row, Col, NavDropdown, Form, Button, Badge, Alert, ButtonToolbar, Modal,Tab, Tabs, Image,Table  } from 'react-bootstrap';
import {userActions} from '../actions';
import { history } from '../helpers';

import {messageActions} from '../actions';


class Logged extends Component {
    constructor(props) {
        super(props);

        this.handleChange = this.handleChange.bind(this);
        this.handleLogout = this.handleLogout.bind(this);
    }
    componentWillMount() {
        const {dispatch} = this.props;

        dispatch(messageActions.getMessageCount());
    }
    handleChange(e) {
        const {name, value} = e.target;
        this.setState({[name]: value});
    }

    handleLogout() {
        this.props.dispatch(userActions.logout());
    }
    goToSettings = () =>{
        history.push('/settings');
    }

    render() {
        const messageCountText = "You have (" + (this.props.messageCount ? this.props.messageCount :  "0") + ") unread message(s).";
        return (
            <div>
                <Row>
                    <Col xs={2} sm={2} md={2} lg={2} >
                    </Col>
                    <Col xs={2} sm={2} md={2} lg={2} >
                        <IconButton className="settingButton" onClick={this.goToSettings} style={{position:'relative',bottom:7}}>
                            <SettingsIcon/>
                        </IconButton>
                    </Col>
                    <Col xs={4} sm={4} md={4} lg={4} >
                        <label style={{position: 'relative', top: 12}}>{localStorage.username}</label>
                    </Col>
                    <Col xs={2} sm={2} md={2} lg={2} >
                        <IconMenu
                            iconButtonElement={
                                <IconButton iconStyle={{color: "#424242"}}><NotificationsIcon/></IconButton>
                            }
                            targetOrigin={{horizontal: 'right', vertical: 'top'}}
                            anchorOrigin={{horizontal: 'right', vertical: 'bottom'}}
                            menuStyle={{maxWidth: "350px"}}
                        >
                            <NavLink to="/messages" style={{textDecoration: "none"}}>
                                <MenuItem primaryText={messageCountText} leftIcon={<FeedbackIcon/>}/>
                            </NavLink>
                            <Divider></Divider>
                            <NavLink to="/send_message" style={{textDecoration: "none"}}>
                                <MenuItem primaryText="Send new message."leftIcon={<FeedbackIcon/>}/>
                            </NavLink>
                            {/* <MenuItem primaryText="Deadline for Test A." leftIcon={<ScheduleIcon/>}/>
                    <MenuItem primaryText="Completed Skill X" leftIcon={<DoneIcon/>}/>
                    <MenuItem primaryText="Received comment on Test B" leftIcon={<FeedbackIcon/>}/> */}
                        </IconMenu>
                    </Col>
                    <Col xs={2} sm={2} md={2} lg={2} >
                        <IconMenu
                            iconButtonElement={
                                <IconButton iconStyle={{color: "#424242"}}><UserIcon/></IconButton>
                            }
                            targetOrigin={{horizontal: 'right', vertical: 'top'}}
                            anchorOrigin={{horizontal: 'right', vertical: 'bottom'}}
                        >
                            <MenuItem primaryText={localStorage.username} leftIcon={<UserIcon/>}/>
                            <Divider/>

                            <NavLink to="/help" style={{textDecoration: "none"}}>
                                <MenuItem primaryText="Help" leftIcon={<HelpIcon/>}/>
                            </NavLink>
                            <Divider/>
                            <MenuItem primaryText="Sign out" leftIcon={<ExitIcon/>} onClick={this.handleLogout}/>
                        </IconMenu>
                    </Col>
                </Row>
            </div>
        )
    };

    static muiName = "IconMenu";
}

function mapStateToProps(state) {
    const {messageCount, fetching} = state.messageCount;
    return {
        messageCount, fetching
    };
}

const connectedLogged = connect(mapStateToProps)(Logged);
export {connectedLogged as Logged};
