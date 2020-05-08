import {TextField} from 'material-ui';
import Chip from 'material-ui/Chip';
import Paper from 'material-ui/Paper';
import Subheader from 'material-ui/Subheader';
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Redirect} from 'react-router';
import {questsActions, studentsActions} from '../../actions';
import {TaskPicker} from '../Quests/TaskPicker';

import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';

const styles = {
    root: {
        width: '100%',
        maxWidth: 800,
        margin: 'auto',
    },
    gridKey: {
        textAlign: "right",
        paddingRight: "38px",
        overflow: "hidden"
    },
    cohort: {
        textAlign: "left"
    },
    chip: {
        margin: 4,
    },
    wrapper: {
        display: 'flex',
        flexWrap: 'wrap',
    },
}
const getInitialState = () => {
    return {
        name: "",
        location: "",
        time_start: undefined,
        time_end: undefined,
        selectedTasks: [],
        selectedCohorts: [],
        cohorts: [],
        resetDisabled: true,
        submitDisabled: true,
        open: false,
        selected_course_id: undefined,
        course_id: 1
    };
};

class CreateTaskGroup extends Component {
    //TODO: implement this or delete
    constructor(props) {
        super(props);
        this.state = getInitialState();
    }

    componentWillMount() {
        const {dispatch} = this.props;
        dispatch(studentsActions.getStudents());

    }

    componentWillReceiveProps(nextProps) {
        if (!this.isEmpty(nextProps.students)) {
            this.setState({cohorts: nextProps.students})
        }
    }

    submit = values => {        
    }
    resetState = () => {
        var initialState = getInitialState();

        this.setState(initialState);
        this.props.dispatch(studentsActions.getStudents());
    }
    handleChangeQuestName = (event, value) => {
        this.setState({
            name: value,
            resetDisabled: false,
            submitDisabled: false,
        });
    }
    handleChangeQuestLocation = (event, value) => {
        this.setState({
            location: value,
            resetDisabled: false,
        });
    }
    handleDateStart = (event, date) => {
        this.setState({
            time_start: date,
            resetDisabled: false,
        })
    }
    handleDateEnd = (event, date) => {
        this.setState({
            time_end: date,
            resetDisabled: false,
        })
    }
    handleChangeTasksCheckbox = (event, checked, task) => {
        var currentTasks = this.state.selectedTasks;
        if (checked) {
            currentTasks.push(task);
        }
        else {
            var index = currentTasks.map((e) => {
                return e.id
            }).indexOf(task.id);
            if (index > -1) {
                currentTasks.splice(index, 1);
            }
        }
        this.setState({
            selectedTasks: currentTasks,
            resetDisabled: false,
        });
    }
    handleDeleteTasksChip = (value) => {
        var currentTasks = this.state.selectedTasks;

        var index = currentTasks.map((e) => {
            return e.id
        }).indexOf(value.id);

        if (index > -1) {
            currentTasks.splice(index, 1);
        }

        this.setState({
            selectedTasks: currentTasks,
            resetDisabled: false,
        });
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
    isEmpty = (obj) => {
        for (var key in obj) {
            if (obj.hasOwnProperty(key))
                return false;
        }
        return true;
    }
    handleChangeCourse = (value) => {
        this.setState({course_id: value})
    }

    renderCohortChip(data) {
        return (
            <Chip
                key={data.id}
                onRequestDelete={() => {
                    this.handleChangeCohortCheckbox(null, false, data);
                    this.forceUpdate()
                }}
                style={styles.chip}
            >
                {data.first_name + " " + data.last_name}
            </Chip>
        );

    }

    render() {
        const {status, questResponse, dispatch} = this.props;

        if (status === "success" && questResponse !== null) {
            var redirectTo = "/planning";

            dispatch(questsActions.clearCreateQuest());
            return (
                <Redirect to={redirectTo}/>
            )
        }
        else {
            return (
                <div style={{display: "flex", justifyContent: "center"}}>
                    <br/>
                    <Paper className={"edtx-paper"} style={{ zDepth: 2 }}>
                        <h2>Create new Task Group</h2>
                        <div style={{width: "70%"}}>
                            <div>
                                Task Group Name: <TextField key="group_name" floatingLabelText="Group Name"/>
                            </div>
                            <Subheader>Select Skillbook</Subheader>
                            <TaskPicker
                                handleChange={this.handleChangeTasksCheckbox}
                                selectedTasks={this.state.selectedTasks}
                                handleChip={this.handleDeleteTasksChip}
                                course_id={this.state.course_id}
                                handleChangeCourse={this.handleChangeCourse}
                            />
                            </div>
                            
                            <div>
                                <FlatButton
                                    label="Reset"
                                    disabled={this.props.resetDisabled}
                                    onClick={(event) => {
                                        this.resetState()
                                    }}
                                    style={{ marginRight: 16}}
                                />
                                <RaisedButton
                                label={this.props.type === "Edit" ? "Update" : "Submit"}
                                primary={true}
                                disabled={this.props.submitDisabled}
                                onClick={this.submit}
                            />
                        </div>
                    </Paper>
                </div>
            )
        }
    }
}

function mapStateToProps(state) {
    const {alert} = state;
    const {status, questResponse} = state.createQuest;
    const {students, fetching} = state.students;

    return {
        status,
        alert,
        questResponse,
        students, fetching,
    };
}

const connectedQuestList = connect(mapStateToProps)(CreateTaskGroup);
export {connectedQuestList as CreateTaskGroup};
