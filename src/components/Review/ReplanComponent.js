import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import moment from 'moment';
import { questsActions } from '../../actions';
import CircularProgress from 'material-ui/CircularProgress';
import { messageActions } from '../../actions';
import { TextField } from 'material-ui';
import { GridList, GridTile } from 'material-ui/GridList';
import { TrainingCenterPicker } from '../Quests/TrainingCenterPicker';
import DateTimePicker from '../DateTimePicker'

const styles = {
    customContentStyle: {
        width: '60%',
        maxWidth: 'none',
    },
    gridKey: {
        textAlign: "right",
        paddingRight: "38px",
        overflow: "hidden",
    },
};
const getInitialState = () => {
    return {
        open: false,
        commentOpen: false,
        selectedOption: null,
        color: "white",
        replanOpen: false,
        time_start: undefined,
        time_end: undefined,
        error_message: undefined,
        comment: "",
        selectedTrainingCenterResources: [],
        training_center_id: 1,
        other_resources: [],
        // time_start: null,
        // time_end: null,
    };
};
class ReplanComponent extends React.Component {
    constructor(props) {
        super(props)
        this.state = getInitialState();
    }
    componentWillMount() {
    }
    componentWillReceiveProps(nextProps) {
        const { status, alert } = nextProps;
        if (alert !== null) {
        }
        if (status === "failure") {
            this.setState({ error_message: "Error sending replan request." })
        }
        else if ((status === "success")) {
            var time_start = this.state.time_start ? moment(this.state.time_start).format() : ""
            var time_end = this.state.time_end ? moment(this.state.time_end).format() : ""
            var timeMessage = "[Replanned for: " + time_start + " - " + time_end + "]"
            var messageData = {
                recipient: this.props.student.username,
                text: "[Activity id: " + this.activityId + " rejected]" + timeMessage + " " + this.state.comment
            }
            this.props.dispatch(messageActions.postMessage(messageData));
            //TODO: clear state
            var initialState = getInitialState();
            this.setState(initialState);
            //
            this.props.dispatch(questsActions.clearCreateQuest());
            this.props.handleClosePlanning("success");
        }
        else {
            this.setState({ error_message: undefined })
        }
    }
    isEmptyOrSpaces(str) {
        return str === null || str.match(/^ *$/) !== null;
    }
    handleCommentChange = (event, value) => {
        event.stopPropagation();
        //
        this.setState({ comment: value });
    }
    handleSubmitReplan = (e) => {
        e.stopPropagation()
        //If no center resources selected the centerData becomes the center's id, if the id is 1 (which is the placeholder id) disregard it.
        var centerId = this.state.training_center_id === 1 ? undefined : this.state.training_center_id;
        var questData = {
            course_id: this.props.quest.group.course_id,
            comment: this.props.quest.comment + " Replan",
            cohort: [this.props.student.username],
            time_start: this.state.time_start ? moment(this.state.time_start).format() : "",
            time_end: this.state.time_end ? moment(this.state.time_end).format() : "",
            tasks: [],
            homework_tasks: [this.props.taskId],
            center: centerId, //this.props.quest.center.id,
            traning_center_resources: this.state.selectedTrainingCenterResources.map(e => e.id),//this.props.quest.traning_center_resources.map(e => e.id),
            other_resources: this.props.quest.other_resources,
        };
        this.props.dispatch(questsActions.createQuest(questData));
    }
    handleOpenReplan = (e) => {
        e.stopPropagation()
        this.setState({ replanOpen: true });
    }
    handleClosePlanning = () => {
        this.props.dispatch(questsActions.clearCreateQuest());
        var initialState = getInitialState();
        this.setState(initialState);
        this.props.handleClosePlanning("failure");
    };
    handleDateStart = (event, date) => {
        this.setState({
            time_start: date,
        })
    }
    handleDateEnd = (event, date) => {
        this.setState({
            time_end: date,
        })
    }
    handleChangeTrainingCenterCheckbox = (event, checked, resource) => {
        //Adds or removes the resource from selection when clicking the checkboxes in trainingcenterpicker.
        var currentResources = this.state.selectedTrainingCenterResources;
        if (checked) {
            currentResources.push(resource);
        }
        else {
            var index = currentResources.map((e) => {
                return e.id
            }).indexOf(resource.id);
            if (index > -1) {
                currentResources.splice(index, 1);
            }
        }
        this.setState({
            selectedTrainingCenterResources: currentResources,
            resetDisabled: false,
        });
    }
    handleDeleteTrainingCenterChip = (value) => {
        var currentResources = this.state.selectedTrainingCenterResources;
        var index = currentResources.map((e) => {
            return e.id
        }).indexOf(value.id);
        if (index > -1) {
            currentResources.splice(index, 1);
        }
        this.setState({
            selectedTrainingCenterResources: currentResources,
            resetDisabled: false,
        });
    }
    handleChangeTrainingCenter = (value) => {
        this.setState({
            training_center_id: value,
            selectedTrainingCenterResources: []
        })
    }
    handleDateStart = (event, date) => {
        this.setState({
            date_start: date,
            resetDisabled: false,
        })
        this.showTimePickerStart();
    }
    handleDateEnd = (event, date) => {
        this.setState({
            date_end: date,
            resetDisabled: false,
        })
        this.showTimePickerEnd();
    }
    showDatePickerStart = () => {
        this.refs.datepicker_start.openDialog();
    }
    showDatePickerEnd = () => {
        this.refs.datepicker_end.openDialog();
    }
    showTimePickerStart() {
        this.refs.timepicker_start.openDialog();
    }
    showTimePickerEnd() {
        this.refs.timepicker_end.openDialog();
    }
    handleChangeTimePickerStart = (event, date) => {
        let momentTime = moment(date);
        let momentDate = moment(this.state.date_start);
        let appointmentMoment = moment({
            year: momentDate.year(),
            month: momentDate.month(),
            day: momentDate.date(),
            hour: momentTime.hours(),
            minute: momentTime.minutes()
        });
        this.setState({ time_start: appointmentMoment });
    };
    handleChangeTimePickerEnd = (event, date) => {
        let momentTime = moment(date);
        let momentDate = moment(this.state.date_end);
        let appointmentMoment = moment({
            year: momentDate.year(),
            month: momentDate.month(),
            day: momentDate.date(),
            hour: momentTime.hours(),
            minute: momentTime.minutes()
        });
        this.setState({ time_end: appointmentMoment });
    };
    handleStartDateTimeChange = m => {
        this.setState({
            time_start: m,
            resetDisabled: false,
        })
    }
    handleEndDateTimeChange = m => {
        this.setState({
            time_end: m,
            resetDisabled: false,
        })
    }
    render() {
        const replanActions = [
            <FlatButton
                label="Cancel"
                primary={true}
                onClick={this.handleClosePlanning}
                disabled={this.props.status === "request"}
            />,
            <FlatButton
                label="Submit"
                primary={true}
                keyboardFocused={true}
                onClick={this.handleSubmitReplan}
                disabled={this.props.status === "request"}
            />,
        ];
        const LocationComponent = [
            <div style={{ width: "60%", marginLeft: "10%" }}>
                <TrainingCenterPicker
                    handleChange={this.handleChangeTrainingCenterCheckbox}
                    selectedTrainingCenter={this.state.training_center_id}
                    selectedResources={this.state.selectedTrainingCenterResources}
                    handleChip={this.handleDeleteTrainingCenterChip}
                    handleChangeTrainingCenter={this.handleChangeTrainingCenter}
                />
            </div>
        ]
        const CommentComponent = [
            <GridList className="syncGrid" cellHeight={80} cols={3}>
                <GridTile style={styles.gridKey}>
                    <span className="syncLabel">Comment</span>
                </GridTile>
                <GridTile cols={2}>
                    <TextField
                        name={"comment-"}
                        onClick={(e) => { e.stopPropagation() }}
                        floatingLabelText={"Comment on task."}
                        onChange={this.handleCommentChange} />
                </GridTile>
            </GridList>
        ]
        // const DatePickComponent = [
        //     DateStartTime,
        //     DateEndTime
        // ]
        // <span>Select the dates for the replanned activity</span>,
        // <DateTimeComponent name="time_start" title="Select Start Date" value={this.state.time_start}
        //     onChange={this.handleDateStart} id="time_start"
        // />,
        // <DateTimeComponent name="time_end" title="Select End Date" value={this.state.time_end}
        //     onChange={this.handleDateEnd} id="time_end"
        // />        
        const DateStartTime2 = [

            <DateTimePicker
                color="black"
                id={"date_start2"}
                redirect={""}
                text="Start Date"
                headerText="Select Start Date"
                onChange={this.handleStartDateTimeChange}
                value={this.state.time_start}
            >
            </DateTimePicker>,
            <DateTimePicker

                color="black"
                id={"date_end2"}
                redirect={""}
                text="End Date"
                headerText="Select End Date"
                onChange={this.handleEndDateTimeChange}
                value={this.state.time_end}
            >
            </DateTimePicker>
        ]
        
        return (
            <Dialog
                title="Replanning of activity"
                actions={replanActions}
                modal={false}
                open={this.props.replanOpen}
                autoScrollBodyContent={true}
                onRequestClose={this.handleClosePlanning}
                contentStyle={styles.customContentStyle}
            >
                Replanning task {this.props.task_display_name}
                <br />
                For student {this.props.student.name}  {this.props.student.lastname}
                <br />
                {DateStartTime2}
                {CommentComponent}
                {LocationComponent}
                <span style={{ color: "red" }}>{this.state.error_message ? this.state.error_message : null}</span>
                {this.props.status === "request" ?
                    <div style={{ marginLeft: "30%" }}>
                        <CircularProgress size={60} thickness={7} />
                    </div>
                    : null}
            </Dialog>
        )
    }
}
function mapStateToProps(state) {
    const { alert } = state;
    const { status, questResponse } = state.createQuest;
    return {
        alert,
        status,
        questResponse,
    };
}
const connectedReplanComponent = connect(mapStateToProps)(ReplanComponent);
const ReplanComponentRouter = withRouter(connectedReplanComponent);
export { ReplanComponentRouter as ReplanComponent };
