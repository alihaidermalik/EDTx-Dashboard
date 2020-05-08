import CircularProgress from 'material-ui/CircularProgress';
import Paper from 'material-ui/Paper';
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui/Table';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { questsActions } from '../../actions';
import moment from "moment";
import { GradeComponent } from "./GradeComponent";
import FlatButton from 'material-ui/FlatButton';
import { Subheader } from 'material-ui';

const styles = ({
    submitButton: {
        margin: 12,
    },
    alignItems: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    chip: {
        margin: 4,
    },
    wrapper: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    taskArea: {


        width: "100%"
    },
});


class Grade extends Component {
    constructor() {
        super();
        this.state = {
            selectedCohorts: [],
            resetDisabled: true,
            expanded: false,
            gradeableQuests: [],

        };
    }

    componentWillMount() {
        const { dispatch, location } = this.props;
        this.questID = location.pathname.split('/')[2];

        dispatch(questsActions.getQuestDetails(this.questID));
    }
    componentWillReceiveProps(nextProps) {

        if (nextProps.cohort) {
        }
        if (nextProps.quest.group) {
            this.setState({ gradeableQuests: nextProps.quest.group.tasks });
        }
    }


    isEmpty = (obj) => {
        for (var key in obj) {
            if (obj.hasOwnProperty(key))
                return false;
        }
        return true;
    }

    handleDelete = () => {
        this.props.dispatch(
            questsActions.deleteQuest(this.questID)
        );
    }

    handleChangeCohortCheckbox = (event, checked, cohort) => {
        var currentCohorts = this.state.selectedCohorts;
        if (checked) {
            currentCohorts.push(cohort);
        }
        else {
            var index = currentCohorts.indexOf(cohort);
            if (index > -1) {
                currentCohorts.splice(index, 1);
            }
        }
        this.setState({
            selectedCohorts: currentCohorts,
            resetDisabled: false,
        });

    }

    handleExpand = (id) => {

        this.setState({
            expanded: !this.state.expanded,
        });
    }

    renderGradeComponents() {

        const questsTasks = this.props.quest.group.tasks;
        return (
            <div key={"grade-div-1"} style={styles.taskArea}>
                {this.props.quest.cohort.users.map((student, i) => ([
                    <Paper
                        key={"paper" + i}
                        style={styles.taskArea}
                    >
                        <GradeComponent
                            key={"grade-component" + i}
                            student={student}
                            tasks={questsTasks}
                            quest={this.props.quest}
                        />
                    </Paper>,
                    <br key={"grade-component-br" + i} />
                ]))
                }
            </div>
        )
    }
    goBack = () => {
        this.props.history.goBack();
    }
    render() {
        const { fetching } = this.props;
        return (
            <div style={{ display: "flex", justifyContent: "center" }}>
                <br />
                <Paper key="grade-paper" className={"edtx-paper"}  style={{ paddingLeft: "5%", zDepth: 2 }}>
                    <div style={{ display: "flex", width: "100%", alignItems: "center" }}>
                        <div style={{ flex: 1 }}>
                            {/* <NavLink to={"/review/"} key={"back-review"}>
                                <FlatButton label="Back to review list" />
                            </NavLink> */}
                            <FlatButton label="Go Back" onClick={this.goBack}/>
                        </div>
                        <div key="grade-div-container" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>

                            <h2 style={{
                                width: "100%",
                                fontSize: "2em",
                                padding: "0 0.3em 0.3em 0.3em"
                            }}>Grade Review</h2>
                        </div>
                        <div style={{ flex: 1 }}></div>
                    </div>
                    {fetching ?
                        <div>
                            <CircularProgress size={60} thickness={7} />
                        </div>
                        :

                        <div
                            key="grade-div"
                            style={{
                                display: "flex",
                                flexWrap: 'wrap',
                                justifyContent: 'space-around',
                                width: "100%"
                            }}>
                            <Subheader>Details</Subheader>
                            <Table>
                                <TableHeader
                                    displaySelectAll={false}
                                    adjustForCheckbox={true}
                                >
                                    <TableRow>
                                        <TableHeaderColumn>Setting</TableHeaderColumn>
                                        <TableHeaderColumn>Value</TableHeaderColumn>
                                    </TableRow>
                                </TableHeader>
                                <TableBody displayRowCheckbox={false} >
                                    {this.props.quest ? [
                                        <TableRow key="acitivity-row" selectable={false}>
                                            <TableRowColumn>Activity Name</TableRowColumn>
                                            <TableRowColumn>{this.props.quest.comment}</TableRowColumn>
                                        </TableRow>,
                                        <TableRow key="start-row" selectable={false}>
                                            <TableRowColumn>Time Start</TableRowColumn>
                                            <TableRowColumn>{moment(this.props.quest.date).format('YYYY-MM-DD HH:mm')}</TableRowColumn>
                                        </TableRow>,
                                        <TableRow key="end-row" selectable={false}>
                                            <TableRowColumn>Time End</TableRowColumn>
                                            <TableRowColumn>{moment(this.props.quest.end_date).format('YYYY-MM-DD : HH:mm')}</TableRowColumn>
                                        </TableRow>,
                                        <TableRow key="training-center-row" selectable={false}>
                                            <TableRowColumn>Training Center</TableRowColumn>
                                            <TableRowColumn>{this.props.quest.center ? this.props.quest.center.name : ""}</TableRowColumn>
                                        </TableRow>,
                                        <TableRow key="training-center-resource-row" selectable={false}>
                                            <TableRowColumn>Training Center Resources</TableRowColumn>
                                            <TableRowColumn>
                                                {this.props.quest.traning_center_resources ?
                                                    this.props.quest.traning_center_resources.map((r) => { return r.facilitie }).toString()
                                                    : null
                                                }
                                            </TableRowColumn>
                                        </TableRow>,
                                        <TableRow key="select-row" selectable={false}>
                                        </TableRow>,
                                    ]
                                        :
                                        <TableRow selectable={false}>
                                            <TableRowColumn>No activity data in database.</TableRowColumn>
                                        </TableRow>
                                    }

                                </TableBody>
                            </Table>
                            <Subheader>Students to be graded</Subheader>
                            <div key="task-div-container" style={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100%" }}>

                                <br />
                                {this.props.quest.cohort
                                    ?
                                    this.renderGradeComponents()
                                    :
                                    <br />
                                }
                                <br />

                            </div>
                        </div>
                    }
                    <div>
                    </div>
                </Paper>
            </div>
        )
    }

}

function mapStateToProps(state) {
    const { fetching, quest } = state.questDetails;

    return {
        fetching,
        quest,
    };
}

const connectedGrade = connect(mapStateToProps)(Grade);
const GradeRouter = withRouter(connectedGrade);

export { GradeRouter as Grade };
