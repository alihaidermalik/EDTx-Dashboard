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
    }
}
class SendMessage extends Component {
    constructor() {
        super();
        this.courseID = null;
        this.state = {
            messageBody: "",
            recipient: ""
        };
    }    
    componentWillMount() {      
        this.props.dispatch(messageActions.clearPostMessage());
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

        dispatch(messageActions.postMessage(messageData));

    };
    handleContactClick = (contact) => {
        
        this.setState({
            recipient: contact.username
        })
    }
    render() {
        const { messageResponse, status, dispatch } = this.props;
        if (status === "success" && messageResponse !== null) {

            var redirectTo = "/messages_chat";

            dispatch(messageActions.clearPostMessage());
            return (
                <Redirect to={redirectTo} />
            )
        } else {
            return (
                <div style={{ display: "flex", justifyContent: "center" }}>
                    <br />
                    <Paper className={"edtx-paper"}  style={{ height: "100%", zDepth: 2 }}>
                        <div style={{ display: "flex", width: "80%", alignItems: "center" }}>
                            <div style={{ flex: 1 }}>
                                <FlatButton label="Go Back" onClick={this.goBack} />
                            </div>
                            <div key="grade-div-container" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                                <h2 style={{
                                    width: "100%",
                                    fontSize: "2em",
                                    padding: "0 0.3em 0.3em 0.3em"
                                }}>Send Message</h2>
                            </div>
                            <div style={{ flex: 1, textAlign: "end" }}>
                            </div>
                        </div>
                        <div style={{ display: "flex", justifyContent: "center", width: "80%" }}>                           
                            <div style={{ flex: 1 }}>
                                <form className="edit-course-form" onSubmit={this.handleSubmit}>
                                    <Subheader>Message</Subheader>
                                    <br />
                                    <div>
                                        <span>To</span>
                                        <br />
                                        <TextField name="prereq" onChange={this.handleChangeReceiver} hintText="Recipient"
                                            value={this.state.recipient} />
                                    </div>
                                    <br />
                                    <div>
                                        <span>Message body</span>
                                        <br />
                                        <TextField
                                            name="prereq"
                                            onChange={this.handleChangeMessageBody}
                                            hintText="Text"
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
                                    </div>
                                </form>
                            </div>

                            <div style={{ flex: 1 }}>
                                <ContactsComponent onClick={this.handleContactClick} style={{ height: 500, overflow: "auto" }} />
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
    return {
        messageResponse, status
    };
}

const connectedSendMessage = connect(mapStateToProps)(SendMessage);
export { connectedSendMessage as SendMessage };
