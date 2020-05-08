import React, { Component } from 'react';
import { connect } from 'react-redux';
import Paper from 'material-ui/Paper';
import FlatButton from 'material-ui/FlatButton';
import { Redirect } from 'react-router';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import { messageActions } from '../../actions';
import { ContactsComponent } from './ContactsComponent';
import Subheader from 'material-ui/Subheader';
import { Divider } from 'material-ui';
import { MessageChatComponent } from './MessageListItemComponent';
import CircularProgress from 'material-ui/CircularProgress';
const styles = {
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
    },
    chatBox: {
        flex: 1,
        marginLeft: 30,
        // overflow: "hidden",
        // maxHeight: "180px",
        height: "400px",
        overflowY: "auto",
        overflowX: "hidden"
    }
}
class MessageChat extends Component {
    constructor() {
        super();
        this.courseID = null;
        this.state = {
            messageBody: "",
            recipient: "",
            selectedUserFullName: "",
            page_size: 15,
            page: 1,
            submitting: false
        };
    }
    //TODO: if they want to scroll to the bottom in the chat box
    // scrollToBottom = () => {
    //     if (this.messagesEnd) {
    //         this.messagesEnd.scrollIntoView({ behavior: "smooth" });
    //     }
    // }
    // componentDidMount() {
    //     this.scrollToBottom();
    // }

    // componentDidUpdate() {
    //     this.scrollToBottom();
    // }
    componentWillMount() {
        this.props.dispatch(messageActions.clearPostMessage());
        // console.log("local storage");
        // for (var i = 0; i < localStorage.length; i++)   {
        //     console.log(localStorage.key(i) + "=[" + localStorage.getItem(localStorage.key(i)) + "]");
        // }
    }
    goBack = () => {
        this.props.history.goBack();
    }
    handleChangeMessageBody = (e, value) => {
        this.setState({
            messageBody: value
        })
    }
    handleChangeReceiver = (e, value) => {
        this.setState({
            recipient: value
        })
    }
    handleSubmit = (e) => {
        e.preventDefault();
        const { dispatch } = this.props;
        var messageData = {
            recipient: this.state.recipient,
            text: this.state.messageBody
        }
        this.setState({
            submitting: true,
            messageBody: ""
        })
        dispatch(messageActions.postMessage(messageData));
    };
    handleContactClick = (contact) => {
        console.log(contact)
        this.setState({
            recipient: contact.username,
            selectedUserFullName: contact.firstname + " " + contact.lastname
        })
        const { dispatch } = this.props;
        dispatch(messageActions.getMessages(contact.username, this.state.page, this.state.page_size));
    }
    isEmpty = (obj) => {
        for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
                return false;
            }
        }
        return true;
    };
    render() {
        const { messageResponse, status, dispatch } = this.props;
        let username = localStorage.getItem('username');
        if (status === "success" && messageResponse !== null) {
            var redirectTo = "/messages_chat";
            dispatch(messageActions.clearPostMessage());
            dispatch(messageActions.getMessages(this.state.recipient, this.state.page, this.state.page_size));
            return (
                <Redirect to={redirectTo} />
            )
        } else {
            return (
                <div style={{ display: "flex", justifyContent: "center" }}>
                    <br />
                    <Paper className={"edtx-paper"} zDepth={2}
                    // style={{ height: "100%" }}
                    >
                        <div style={{ display: "flex", width: "80%", alignItems: "center" }}>
                            <div style={{ flex: 1 }}>
                                <FlatButton label="Go Back" onClick={this.goBack} />
                            </div>
                            <div key="grade-div-container" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                                <h2 style={{
                                    width: "100%",
                                    fontSize: "2em",
                                    padding: "0 0.3em 0.3em 0.3em"
                                }}>Your messages</h2>
                            </div>
                            <div style={{ flex: 1, textAlign: "end" }}>
                            </div>
                        </div>
                        <div style={{ display: "flex", justifyContent: "center", width: "80%" }}>
                            <div style={{ flex: "0.4" }}>
                                <ContactsComponent onClick={this.handleContactClick} style={{ height: 500, overflow: "auto", width: "100%" }} />
                            </div>
                            <div style={{ flex: 1 }}>
                                {this.state.recipient !== "" ?
                                    <div style={{ marginRight: "5px" }}>
                                        <Subheader ><span><h3>Conversation with {this.state.selectedUserFullName !== "" ? this.state.selectedUserFullName : "[Name error]"} (username: {this.state.recipient})</h3></span></Subheader>
                                        <div style={styles.chatBox}>
                                            {this.props.messages && this.props.messages.fetching ?
                                                <CircularProgress size={60} thickness={7} />
                                                :
                                                null
                                            }
                                            {!this.isEmpty(this.props.messages.results) ?
                                                this.props.messages.results.map((message, i) => (
                                                    [
                                                        <MessageChatComponent
                                                            key={message.id}
                                                            message={message}
                                                            redirectTo={"/message/" + message.id}
                                                            senderStyling={message.sender.username === username}
                                                        />
                                                        ,
                                                        <br />
                                                    ]
                                                ))
                                                :
                                                <span>No messages.</span>
                                            }
                                            <div style={{ float: "left", clear: "both" }}
                                                ref={(el) => { this.messagesEnd = el; }}>
                                            </div>
                                        </div>
                                        <div>
                                            <br />
                                            <Divider />
                                        </div>
                                        <form className="edit-course-form" onSubmit={this.handleSubmit}>
                                            <Subheader>Write a Message</Subheader>
                                            <div style={{ marginLeft: 10 }}>
                                                <TextField
                                                    name="prereq"
                                                    onChange={this.handleChangeMessageBody}
                                                    hintText="Text to send."
                                                    value={this.state.messageBody}
                                                    multiLine={true}
                                                    rows={2}
                                                    rowsMax={4}
                                                />
                                                <br />
                                            </div>
                                            <br />
                                            <div>
                                                <RaisedButton label="Send" style={styles.submitButton} onClick={this.handleSubmit}
                                                    backgroundColor={"#364D7C"} labelColor="#fff" />
                                                {this.state.submitting ?
                                                    <CircularProgress style={{ marginLeft: 5 }} size={30} thickness={7} />
                                                    :
                                                    null
                                                }
                                            </div>
                                        </form>
                                    </div>
                                    :
                                    <div>
                                        <Subheader ><span><h3>Choose a contact. </h3></span></Subheader>
                                        <div style={{ float: "left", clear: "both" }}
                                            ref={(el) => { this.messagesEnd = el; }}>
                                        </div>
                                    </div>

                                }
                            </div>
                        </div>
                    </Paper>
                </div>
            )
        }
    }
}
function mapStateToProps(state) {
    const { messageResponse, status } = state.postMessage;
    const { fetching, messages } = state.messages;
    return {
        messageResponse, status,
        fetching,
        messages
    };
}
const connectedMessageChat = connect(mapStateToProps)(MessageChat);
export { connectedMessageChat as MessageChat };
