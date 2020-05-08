import CircularProgress from 'material-ui/CircularProgress';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { messageActions } from '../../actions';
import { MessageListItemComponent } from './MessageListItemComponent';
import Subheader from 'material-ui/Subheader';
import Paper from 'material-ui/Paper';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import { TextField } from 'material-ui';
const styles = {
    gridKey: {
        paddingRight: "38px",
        overflow: "hidden",
        alignItems: 'center',
        display: 'flex'
    },
    menuItem: {
        width: "100%"
    },
    customWidth: {
        width: "100%"
    },
    DropDownMenu: {
        display: 'flex',
        width: "100%",
        alignContent: 'center',
        alignItems: 'center'
    },
    taskArea: {
        width: "100%"
    },
    gradeItemMiddle: {
        display: 'flex',
        flex: 1,
        justifyContent: "flex-end",
        width: "15%"
    },
    gradeItemEnd: {
        display: 'flex',
        flex: 1,
        justifyContent: "flex-end",
    },
    cutText: {
        textOverflow: "ellipsis",
        overflow: "hidden",
        whiteSpace: "nowrap",
        width: "33%"
    }
}
class MessageList extends Component {
    constructor() {
        super();
        this.courseID = null;
        this.state = {
            messages: {},
            page_size: 15,
            page: 1,
            next_page: null,
            prev_page: null,
            pageCount: null,
            searchUserValue: null
        };
    }
    componentWillMount() {
        const { dispatch } = this.props;
        let username = localStorage.getItem('username');

        dispatch(messageActions.getMessages(username, this.state.page, this.state.page_size));
    }
    componentWillReceiveProps(nextProps) {
        if (!this.isEmpty(nextProps.messages)) {
            let pageCount = parseInt(nextProps.messages.count / this.state.page_size, 10);
            if (nextProps.messages.count % this.state.page_size > 0) {
                pageCount++;
            }
            this.setState({
                messages: nextProps.messages.results,
                next_page: nextProps.messages.next ? this.state.page + 1 : null,
                prev_page: nextProps.messages.previous ? this.state.page - 1 : null,
                pageCount: pageCount
            })
        }
    }
    isEmpty = (obj) => {
        for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
                return false;
            }
        }
        return true;
    };
    PageDropDown = () => {
        if (this.state.pageCount > 1) {
            const items = [];
            for (let i = 1; i <= this.state.pageCount; i++) {
                items.push(<MenuItem value={i} key={i} primaryText={`${i}`} />);
            }
            return (
                <div style={{display: "flex",alignItems: "center"}}>
                <span>Page: {this.state.page} out of {this.state.pageCount} </span>

                <div style={{display: "flex",alignItems: "center"}} key="messages-drop-down">
                    <span style={{ paddingLeft: 15 }}> Go to: </span>
                    <div style={{ paddingBottom: 3 }}>
                        <DropDownMenu maxHeight={300} value={this.state.page} onChange={this.handlePageDropDownChange}>
                            {items}
                        </DropDownMenu>
                    </div>
                    </div>
                    </div>
            )
        }
    }
    handleGoPrev = () => {
        this.setState({
            page: this.state.prev_page
        })
        this.props.dispatch(messageActions.getMessages(this.state.page, this.state.page_size));
    }
    handleGoNext = () => {
        this.setState({
            page: this.state.next_page
        })
        this.props.dispatch(messageActions.getMessages(this.state.next_page, this.state.page_size));
    }
    searchUsers = () =>{
        if(this.state.searchUserValue !== null){
            var searchValue = this.state.searchUserValue.toString().toLowerCase();
            var filteredMessages = this.props.messages.results.slice(0).filter(message => {
                var sender = message.sender.name ? message.sender.name.toString().toLowerCase() : "";
                return sender.includes(searchValue)
            })
            this.setState({
                messages : filteredMessages
            })
        }
    }
    handleChangeSearch = (event, value) => {
        this.setState({
            searchUserValue: value,
        });
      }
      searchClear = () => {
        this.setState({
            messages : this.props.messages.results
        })
      }
    render() {
        const { fetching } = this.props;
        const MessageHeader = (
            <Subheader key="messages-sub-header" style={{ display: "flex", padding: "10px 10px 10px 15px" }}>
                <div style={styles.cutText}>
                    <span>Message</span>
                </div>
                <div style={styles.gradeItemMiddle}>
                    <span>Sender</span>
                </div>
                <div style={styles.gradeItemMiddle}>
                    <span>Sent at</span>
                </div>
                <div style={styles.gradeItemMiddle}>
                </div>
            </Subheader>
        )
        const Header = [
            <div key="messages-header" style={{ display: "flex", width: "100%", alignItems: "center" }}>
                <div style={{ flex: 1 }}>
                    {this.state.prev_page ?
                        <FlatButton label="Previous Page" onClick={this.handleGoPrev} />
                        :
                        null}
                </div>
                <div key="grade-div-container" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                    {/* <h3 style={{
                        width: "100%",
                        fontSize: "2em",
                        padding: "0 0.3em 0.3em 0.3em"
                    }}>Page: {this.state.page}</h3> */}
                    {this.PageDropDown()}
                </div>
                <div style={{ flex: "intial" }}>
                    {this.state.next_page ?
                        <FlatButton label="Next Page" onClick={this.handleGoNext} />
                        :
                        null}
                </div>
            </div>
        ]
        const SearchUsers = [
            <div key="messages-header" style={{ display: "flex", width: "100%", alignItems: "center" }}>
                <div style={{ flex: 1 }}>
                    <TextField name="name" onChange={this.handleChangeSearch}
                        floatingLabelText={"Search Usernames"}
                        // value={this.state.searchCalendar}
                        // onKeyPress={this.handleKeyPress}
                        style={{ paddingBottom: 10 }}
                        />
                        <FlatButton label="Search User" onClick={this.searchUsers} />
                        <FlatButton label="Clear" onClick={this.searchClear} />

                        
                </div>
             
            </div>
        ]
        return (
            <div style={{ display: "flex", justifyContent: "center" }}>
                <br />
                <Paper key="messages-paper" className={"edtx-paper"}  style={{ height: "100%", zDepth: 2 }}>
                    <div style={{ display: "flex", width: "80%", alignItems: "center" }}>
                        <div style={{ flex: 1 }}>
                        </div>
                        <div key="grade-div-container" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                            <h2 style={{
                                width: "100%",
                                fontSize: "2em",
                                padding: "0 0.3em 0.3em 0.3em"
                            }}>Messages received</h2>
                        </div>
                        <div style={{ flex: 1, textAlign: "end" }}>
                            <NavLink style={{
                                width: "100%",
                                marginRight: 3,
                                display: "flex",
                                justifyContent: "flex-start",
                                textDecoration: "none"
                            }} to="/send_message">
                                <RaisedButton label="Send new message" />
                            </NavLink>
                        </div>
                    </div>
                    {fetching ?
                        <div>
                            <CircularProgress size={60} thickness={7} />
                        </div> :
                        <div key="messages-container" style={{
                            display: "flex",
                            flexWrap: 'wrap',
                            justifyContent: 'space-around',
                            width: "80%"
                        }}>
                            <div key="messages-inner-container" style={{ width: "100%" }}>
                                {SearchUsers}
                                {Header}
                                {MessageHeader}
                                {/* {this.props.messages && this.props.messages.results && this.props.messages.results.length > 0 ?
                                    this.props.messages.results.map((message, i) => (
                                        [
                                            <MessageListItemComponent key={message.id} message={message} redirectTo={"/message/" + message.id} />
                                            ,
                                            <br />
                                        ]
                                    ))
                                    :
                                    <span>No messages.</span>
                                } */}
                                {this.state.messages  && this.state.messages.length > 0 ?
                                    this.state.messages.map((message, i) => (
                                        [
                                            <MessageListItemComponent key={message.id} message={message} redirectTo={"/message/" + message.id} />
                                            ,
                                            <br />
                                        ]
                                    ))
                                    :
                                    <span>No messages.</span>
                                }
                                {Header}
                            </div>
                        </div>
                    }
                </Paper>
            </div>
        )
    }
}
function mapStateToProps(state) {
    const { fetching, messages } = state.messages;
    return {
        fetching,
        messages
    };
}
const connectedMessageList = connect(mapStateToProps)(MessageList);
export { connectedMessageList as MessageList };
