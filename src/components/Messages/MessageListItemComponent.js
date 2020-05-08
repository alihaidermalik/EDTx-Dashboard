import IconButton from 'material-ui/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from "react-redux";
import Paper from 'material-ui/Paper';
import Subheader from 'material-ui/Subheader';

import moment from 'moment';

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
        // width: "160px",
        // height: "1.2em", 
        whiteSpace: "nowrap",
        // width: "33%",
        lineHeight: "2em",
        maxHeight: "100px"
    },
    senderStyle: { width: "50%", marginLeft: "50%", backgroundColor: "rgb(54, 77, 124)", color: "white" },
    receiverStyle: { width: "50%" },
    weighted: { fontWeight: "600 !important", color: "black" },
    weightedSender: { fontWeight: "600 !important", color: "white" },
    bubbleDate: {
        flex: 1,
        fontSize: "12px",
        padding: "10px 10px 10px 15px"

    }
}
export class MessageListItemComponent extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            open: false,
            deleteOpen: false
        };
    }

    handleOpen = event => {
        event.stopPropagation();

        this.setState({ open: !this.state.open });
    };

    handleClose = () => {
        this.setState({ open: false });
    };

    handleRedirect = () => {
        const { history } = this.props;
        const { redirectTo } = this.props;
        history.push(redirectTo);
    };


    render() {
        const { message } = this.props;
        const sent_at = message.sent_at ? moment(message.sent_at).format('YYYY-MM-DD HH:mm') : ""
        // const read_at = message.read_at ? moment(message.read_at).format('YYYY-MM-DD HH:mm') : "" //doesnt seem necessary
        const sender = message.sender.name ? message.sender.name : ""
        return (
            <Paper key={message.id} style={{ backgroundColor: "#f2f2f2" }} style={this.props.style}>
                {/* ""rgb(54, 77, 124)"}}>  */}
                {/* //"rgb(195, 207, 232)" */}
                <div key={message.id + "-paper-div"} style={styles.taskArea} onClick={this.handleOpen}>
                    <Subheader style={{ display: "flex", padding: "10px 10px 10px 15px" }}>
                        <div style={styles.cutText}>
                            <span
                                style={{
                                    fontWeight: "400 !important",
                                    color: "black",
                                    fontSize: "1.5em"
                                }}
                            >
                                {
                                    message.body ? message.body : "Message ID: " + message.id
                                }
                            </span>
                        </div>
                        <div style={styles.gradeItemMiddle}>
                            <span style={{ fontWeight: "600 !important", color: "black" }}>{sender}</span>
                        </div>
                        <div style={styles.gradeItemMiddle}>
                            <span style={{ fontWeight: "600 !important", color: "black" }}>{sent_at}</span>
                        </div>
                        <div style={styles.gradeItemMiddle}>
                            <div>
                                <IconButton onClick={this.handleOpen} style={styles.gradeItemEnd}>
                                    <MoreVertIcon color="black" />
                                </IconButton>
                            </div>
                        </div>
                    </Subheader>
                    {this.state.open ?
                        [
                            <div key={message.id + "-div"} >
                                <div style={{ fontWeight: "600 !important", color: "black", padding: "16px", lineHeight: "1.5em" }}>
                                    <span>Body: </span>
                                    <br />
                                    <span>
                                        {message.body}
                                    </span>
                                    <br />
                                    <br />
                                    <span>Sender: </span>
                                    <span>
                                        {sender}
                                    </span>
                                    <br />
                                    <span>Time sent: </span>
                                    <span>
                                        {moment(this.props.message.sent_at).format('YYYY-MM-DD HH:mm')}
                                    </span>
                                    <br />
                                    <span>Time read: </span>
                                    <span>
                                        {moment(this.props.message.read_at).format('YYYY-MM-DD HH:mm')}
                                    </span>
                                    <br />

                                </div>
                            </div>,
                        ] :
                        null
                    }
                </div>
            </Paper>

        )
    }
}

export class MessageChatComponent extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            open: false,
            deleteOpen: false
        };
    }

    handleOpen = event => {
        event.stopPropagation();

        this.setState({ open: !this.state.open });
    };

    handleClose = () => {
        this.setState({ open: false });
    };

    handleRedirect = () => {
        const { history } = this.props;
        const { redirectTo } = this.props;
        history.push(redirectTo);
    };


    render() {
        const { message } = this.props;
        const sent_at = message.sent_at ? moment(message.sent_at).format('YYYY-MM-DD HH:mm') : ""
        // const read_at = message.read_at ? moment(message.read_at).format('YYYY-MM-DD HH:mm') : "" //doesnt seem necessary
        const sender = message.sender.name ? message.sender.name : ""
        const bubbleStyle = "talk-bubble tri-right border round " + (this.props.senderStyling ? "btm-right-in" : "btm-left-in")
        return (
            <Paper key={message.id}
                style={{ backgroundColor: "#F2F2F2" }}
                // "#f2f2f2" 
                className={bubbleStyle}
                // className={this.props.senderStyling ? "btm-right-in" : "btm-left-in"}
                style={this.props.senderStyling ? styles.senderStyle : styles.receiverStyle}>
                {/* ""rgb(54, 77, 124)"}}>  */}
                {/* //"rgb(195, 207, 232)" */}
                <div key={message.id + "-paper-div"} style={styles.taskArea} onClick={this.handleOpen}>
                    <Subheader style={{ display: "flex", padding: "10px 10px 10px 15px" }}>

                        <div style={styles.cutText}>
                            <span
                                style={{
                                    fontWeight: "400 !important",
                                    color: this.props.senderStyling ? "white" : "black",
                                    fontSize: "1.5em"
                                }}
                            >
                                {
                                    message.body ? message.body : "Message ID: " + message.id

                                }

                            </span>
                        </div>
                        <div style={styles.gradeItemMiddle}></div>
                        <div style={styles.gradeItemMiddle}>
                            <IconButton onClick={this.handleOpen} style={styles.gradeItemEnd} style={{bottom: "7px"}}>
                                <MoreVertIcon color={this.props.senderStyling ? "white" : "black"} />
                            </IconButton>

                        </div>
                    </Subheader>

                    <div>
                        <div style={styles.bubbleDate}>
                            <span style={{ fontWeight: "600 !important", color: this.props.senderStyling ? "white" : "black" }}>{moment(this.props.message.sent_at).format('YYYY-MM-DD HH:mm')}</span>
                        </div>
                    </div>
                    {this.state.open ?
                        [
                            <div key={message.id + "-div"} >
                                <div style={{ fontWeight: "600 !important", color: this.props.senderStyling ? "white" : "black", padding: "16px", lineHeight: "1.5em" }}>
                                    <span>Body: </span>
                                    <br />
                                    <span>
                                        {message.body}
                                    </span>
                                    <br />
                                    <br />
                                    <span>Sender: </span>
                                    <span>
                                        {sender}
                                    </span>
                                    <br />
                                    <span>Time sent: </span>
                                    <span>
                                        {moment(this.props.message.sent_at).format('YYYY-MM-DD HH:mm')}
                                    </span>
                                    <br />
                                    <span>Time read: </span>
                                    <span>
                                        {moment(this.props.message.read_at).format('YYYY-MM-DD HH:mm')}
                                    </span>
                                    <br />

                                </div>
                            </div>,
                        ] :
                        null
                    }
                </div>
            </Paper>

        )
    }
}