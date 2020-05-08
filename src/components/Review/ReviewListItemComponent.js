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
}
class ReviewListItemComponent extends React.Component {
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
        const { quest } = this.props;
        const start_date = moment(quest.date).format('YYYY-MM-DD')
        const end_date = moment(quest.end_date).format('YYYY-MM-DD')
        return (
            <Paper key={quest.id} style={{ backgroundColor: "#f2f2f2" }}>
                {/* ""rgb(54, 77, 124)"}}>  */}
                {/* //"rgb(195, 207, 232)" */}
                <div style={styles.taskArea} onClick={this.handleRedirect}>
                    <Subheader style={{ display: "flex", padding: "10px 10px 10px 15px" }}>
                        <div
                            style={{
                                width: "33%"
                            }}
                        >
                            <span
                                style={{
                                    fontWeight: "400 !important",
                                    color: "black",
                                    fontSize: "1.5em"
                                }}
                            >
                                {
                                    quest.comment ? quest.comment : "Activity ID: " + quest.id

                                }

                            </span>
                        </div>
                        <div style={styles.gradeItemMiddle}>
                            <span style={{ fontWeight: "600 !important", color: "black" }}>{start_date + " - " + end_date}</span>
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
                            <div>
                                <div style={{ fontWeight: "600 !important", color: "black", padding: "16px", lineHeight: "1.5em" }}>

                                    <span>Time Start: </span>
                                    <span>
                                        {moment(this.props.quest.date).format('YYYY-MM-DD HH:mm')}
                                    </span>
                                    <br />
                                    <span>Time End: </span>
                                    <span>
                                        {moment(this.props.quest.end_date).format('YYYY-MM-DD HH:mm')}
                                    </span>
                                    <br />
                                    <span>Training Center: </span>
                                    <span>
                                        {this.props.quest.center ? this.props.quest.center.name : ""}
                                    </span>
                                    <br />
                                    <span>Training Center Resources: </span>
                                    <span>
                                        {this.props.quest.traning_center_resources ?
                                            this.props.quest.traning_center_resources.map((r) => { return r.facilitie }).toString()
                                            : null
                                        }
                                    </span>
                                    <br />
                                    {/* Location: {quest.location} */}

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

const mapStateToProps = (state) => state.deleteQuest;

const connectedReviewListItemComponent = connect(mapStateToProps)(ReviewListItemComponent);
const ListItemRouter = withRouter(connectedReviewListItemComponent);

export { ListItemRouter as ReviewListItemComponent };