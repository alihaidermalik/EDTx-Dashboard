import { TextField, FlatButton, Divider, Text } from 'material-ui';
import Chip from 'material-ui/Chip';
import CircularProgress from 'material-ui/CircularProgress';
import { GridList, GridTile } from 'material-ui/GridList';
import { List } from 'material-ui/List';
import Paper from 'material-ui/Paper';
import Subheader from 'material-ui/Subheader';
import moment from 'moment';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router';
import { alertActions, questsActions, studentsActions, messageActions } from '../../actions';
import { Pagination, PaginationListItems } from './Pagination';
import { PaginationCohorts, PaginationListCohorts } from './PaginationChorots';
import QuestStepper from './QuestStepper';
import { TaskPicker } from './TaskPicker';
import { TrainingCenterPicker } from './TrainingCenterPicker';
import Toggle from 'material-ui/Toggle';
import DateTimePicker from '../DateTimePicker'
import { studentsService } from '../../services';
import axios from 'axios'

const styles = {
    root: {
        width: '100%',
        maxWidth: 1200,
        margin: 'auto',
    },
    gridKey: {
        textAlign: "right",
        paddingRight: "38px",
        overflow: "hidden"
    },
    gridKey2: {
        textAlign: "left",
        paddingRight: "38px",
        overflow: "hidden",
        display: 'flex',
        alignItems: 'center',
        paddingTop: 10
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
    button: { margin: 12, }
}
const getInitialState = (recieved_user_ids) => {
    return {
        name: "",
        date_start: undefined,
        date_end: undefined,
        selectedTasks: [],
        selectedHomework: [],
        selectedCohorts: [],
        selectedCourseCohorts: [],
        selectedTrainingCenterResources: [],
        cohorts: [],
        courseCohorts: [],
        resetDisabled: true,
        submitDisabled: true,
        open: false,
        selected_course_id: undefined,
        course_id: 1,
        training_center_id: 1,
        homework: false,
        cohortType: "ALL",
        searchUsername: undefined,
        searchCohortGroup: undefined,
        other_resources: [],
        time_start: null,
        time_end: null,
        sendMessage: false,
        messageBody: "",
        received_student_ids: recieved_user_ids,
    };
};
class CreateQuest extends Component {
    constructor(props) {
        super(props);
        let path = window.location.pathname.split("/");
        let recieved_user_ids = [];
        if(path[2]){
            if(path[2] == 1) {
                recieved_user_ids = this.props.location.state.user_ids;
            }
        }
        this.state = getInitialState(recieved_user_ids);
    }
    componentWillMount() {
        const { dispatch } = this.props;
        dispatch(studentsActions.getStudents());
    }
    componentWillReceiveProps(nextProps) {
        if (!this.isEmpty(nextProps.students)) {
            this.filterStudents(nextProps.students);
        }
    }
    componentDidMount() {
        if (this.props.location.state && this.props.location.state.eventStart && this.props.location.state.eventEnd) {

            var eventStart = moment(this.props.location.state.eventStart)
            var eventEnd = moment(this.props.location.state.eventEnd)

            this.props.location.state = null;
            this.setState({
                time_start: eventStart,
                time_end: eventEnd
            })
        }
    }
    filterStudents = (students) => {
        var filteredStudents = students;
        let selectedChortsArray = [];
        if(this.state.received_student_ids.length>0){
            for(let i=0;i<this.state.received_student_ids.length;i++){
                for(let j=0;j<filteredStudents.length;j++){
                    if(this.state.received_student_ids[i] == filteredStudents[j].id){
                        selectedChortsArray.push(filteredStudents[j]);
                        break;
                    }
                }
            }
        }
        this.setState({
            selectedCohorts: selectedChortsArray
        });
        console.log(filteredStudents);
        console.log("this.state.received_student_ids");
        console.log(this.state.received_student_ids);
        if (this.state.cohortType !== "ALL") {
            filteredStudents = filteredStudents.filter(s => s.country === this.state.cohortType)
        }
        if (this.state.searchUsername !== undefined) {
            filteredStudents = filteredStudents.filter(s => s.name.toLowerCase().includes(this.state.searchUsername.toLowerCase()))
        }
        this.setState({ cohorts: filteredStudents })
    }
    submit = values => {
        const { dispatch } = this.props;
        if (this.state.name === undefined) {
            dispatch(alertActions.error("Not all required fields filled in."));
        } else {
            //If no center resources selected the centerData becomes the center's id, if the id is 1 (which is the placeholder id) disregard it.
            var centerId = this.state.training_center_id === 1 ? undefined : this.state.training_center_id;
            var questData = {
                course_id: this.state.course_id,
                comment: this.state.name,//old prop was 'name'
                cohort: this.state.selectedCohorts.map(e => e.username),
                time_start: this.state.time_start ? moment(this.state.time_start).format() : "",
                time_end: this.state.time_end ? moment(this.state.time_end).format() : "",
                tasks: this.state.selectedTasks.map(e => e.section_url),
                homework_tasks: this.state.selectedHomework.map(e => e.section_url),
                center: centerId,
                traning_center_resources: this.state.selectedTrainingCenterResources.map(e => e.id),
                other_resources: this.state.other_resources
            };
            dispatch(questsActions.createQuest(questData));
        }
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
   
    handleChangeTasksCheckbox = (event, checked, task) => {
        var currentTasks = this.state.selectedTasks;
        // var currentHomeworkTasks = this.state.selectedHomework;
        if (checked) {
            currentTasks.push(task);
            // var index = currentHomeworkTasks.map((e) => {
            //     return e.section_url
            // }).indexOf(task.section_url);
            // if (index > -1) {
            //     currentHomeworkTasks.splice(index, 1);
            // }
        }
        else {
            var index2 = currentTasks.map((e) => {
                return e.section_url
            }).indexOf(task.section_url);
            if (index2 > -1) {
                currentTasks.splice(index2, 1);
            }
        }
        this.setState({
            selectedTasks: currentTasks,
            resetDisabled: false,
        });
    }
    handleChangeHomeworkCheckbox = (event, checked, task) => {
        var currentTasks = this.state.selectedTasks;
        var currentHomeworkTasks = this.state.selectedHomework;
        if (checked) {
            currentHomeworkTasks.push(task);
            // var index = currentTasks.map((e) => {
            //     return e.section_url
            // }).indexOf(task.section_url);
            // if (index > -1) {
            //     currentTasks.splice(index, 1);
            // }
        }
        else {
            // currentTasks.push(task);
            var index3 = currentHomeworkTasks.map((e) => {
                return e.section_url
            }).indexOf(task.section_url);
            if (index3 > -1) {
                currentHomeworkTasks.splice(index3, 1);
            }
        }
        this.setState({
            selectedHomework: currentHomeworkTasks,
            selectedTasks: currentTasks,
            resetDisabled: false,
        });
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
    handleHomeworkChip = (value) => {
        var currentTasks = this.state.selectedHomework;
        var index = currentTasks.map((e) => {
            return e.id
        }).indexOf(value.id);
        if (index > -1) {
            currentTasks.splice(index, 1);
        }
        this.setState({
            selectedHomework: currentTasks,
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
    handleSelectAllCohorts = (event, checked) => {
        var newSelectedCohorts = []
        if (checked) {
            var allCohorts = this.state.cohorts
            var currentCohorts = this.state.selectedCohorts;
            newSelectedCohorts = currentCohorts.concat(allCohorts.filter(function (item) {
                return currentCohorts.indexOf(item) < 0;
            }));
        }
        this.setState({
            selectedCohorts: newSelectedCohorts,
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

    handleChangeCohortsCheckbox = (event, checked, cohort) => {
        var currentCohorts = this.state.selectedCohorts;
        for(let i=0;i<cohort.users.length; i++){
            if (checked) {
                currentCohorts.push(cohort.users[i]);
            }
            else {
                var index = currentCohorts.indexOf(cohort.users[i]);
                if (index > -1) {
                    currentCohorts.splice(index, 1);
                }
            }

            let uniqueData = [...new Set(currentCohorts)];

            this.setState({
                selectedCohorts: uniqueData,
                resetDisabled: false,
            });

        }
        
    }

    isEmpty = (obj) => {
        for (var key in obj) {
            if (obj.hasOwnProperty(key))
                return false;
        }
        return true;
    }
    handleChangeChortType = (e, index, value) => {
        this.setState({ cohortType: value })
    }
    handleChangeSearchUsername = (event, value) => {
        this.setState({
            searchUsername: value,
        });
    }
    handleChangeSearchCohortGroup = (event, value) => {
        this.setState({
            searchCohortGroup: value,
        });
    }
    handleClearSearch = (event, value) => {
        this.setState({
            searchUsername: undefined,
            searchCohortGroup: undefined
        });
        this.searchStudents();
    }
    handleChangeCourse = (value) => {

        console.log("================================ handlechangecourse"+value)
        const { dispatch } = this.props;
        this.setState({ 
            course_id: value,
            courseCohorts: studentsActions.getCohorts(this.state.course_id), 
        })

        let user = JSON.parse(localStorage.getItem('user'));
    
     axios.get(process.env.REACT_APP_API_URL + "/api/cohorts/" + value + "/",
        {
            headers: {
                "X-Authorization": "Token " + user["access_token"]
            }
        })
        .then(response => {
            this.setState({courseCohorts:response.data});
            console.log(this.state.courseCohorts)
        })
        .catch(function(error){
            console.log("================================== error in axios getCohorts")
            console.log(error);
        });
    }
    handleChangeTrainingCenter = (value) => {
        this.setState({
            training_center_id: value,
            selectedTrainingCenterResources: []
        })
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
                {data.name}
            </Chip>
        );
    }
    searchStudents = () => {
        this.props.dispatch(studentsActions.getStudents(this.state.searchUsername, this.state.searchCohortGroup))
    }
    
    handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            this.searchStudents();
        }
    }
    handleSendMessageToggle = (event, value) => {
        this.setState({
            sendMessage: value,
            resetDisabled: false,
        })
    }
    handleChangeMessageBody = (e, value) => {
        this.setState({
            messageBody: value
        })
    }
    postMessages = () => {
        if (this.state.sendMessage) {
            var studentIDs = this.state.selectedCohorts.map(c => c.id);
            var messageData = {
                recipients: studentIDs,
                text: this.state.messageBody
            }
            this.props.dispatch(messageActions.postMessageMulti(messageData));
            this.props.dispatch(messageActions.clearPostMessage());         
        }
    }
    goBack = () => {
        this.props.history.goBack();
    }
    handleStartDateTimeChange = m => {
        this.setState({
            time_start : m,
            resetDisabled: false,
        })
    }
    handleEndDateTimeChange = m => {
        this.setState({
            time_end : m,
            resetDisabled: false,
        })
    }
    render() {
        const { status, questResponse, dispatch, fetching } = this.props;        
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
       
        const QuestSettings = [
            <GridList className="syncGrid" cellHeight={80} cols={3}>
                <GridTile style={styles.gridKey}>
                    <span className="syncLabel">Activity Name</span>
                </GridTile>
                <GridTile cols={2}>
                    <TextField name="name" onChange={this.handleChangeQuestName} hintText="Activity Name"
                        value={this.state.name} />
                </GridTile>
            </GridList>
        ]
        const SearchCohorts = [
            <div style={styles.root}>
                <GridList style={{ paddingLeft: "16px" }} className="syncGrid" cellHeight={80} cols={10}>
                    <Subheader>Search Students</Subheader>
                    <GridTile style={styles.gridKey}>
                        <span className="syncLabel">Username</span>
                    </GridTile>
                    <GridTile cols={2}>
                        <TextField name="name" onChange={this.handleChangeSearchUsername} hintText="Username"
                            value={this.state.searchUsername}
                            onKeyPress={this.handleKeyPress}
                        />
                    </GridTile>
                    <GridTile style={styles.gridKey}>
                        <span className="syncLabel">Cohort group</span>
                    </GridTile>
                    <GridTile cols={2}>
                        <TextField name="name" onChange={this.handleChangeSearchCohortGroup} hintText="Cohort group"
                            value={this.state.searchCohortGroup}
                            onKeyPress={this.handleKeyPress}
                        />
                    </GridTile>
                   
                    <GridTile cols={4}>                        
                        <FlatButton
                            label="Search"
                            primary={true}
                            style={{ margin: 12 }}
                            onClick={this.searchStudents}
                        />
                                                                 
                        <FlatButton
                            label="Clear"
                            primary={true}
                            style={{ margin: 12 }}
                            onClick={this.handleClearSearch}
                        />
                    </GridTile>
                </GridList>
            </div>
        ]
        const Cohorts = [
           /* !fetching ?*/
                <div style={{flexDirection:"row", display:"flex"}}>
                    <List>
                        <Subheader>Select User</Subheader>
                        {!this.isEmpty(this.state.selectedCohorts)
                            ?
                            <div style={styles.wrapper}>
                                {
                                    this.state.selectedCohorts.map(cohort => this.renderCohortChip(cohort))
                                }
                            </div>
                            : null
                        }
                        {this.state.cohorts
                            ?
                            <Pagination
                                data={this.state.cohorts}
                            >
                                <PaginationListItems
                                    handleChangeCohortCheckbox={this.handleChangeCohortCheckbox}
                                    selectedCohorts={this.state.selectedCohorts}
                                    handleSelectAllCohorts={this.handleSelectAllCohorts}
                                />
                            </Pagination>
                            :
                            <div> No cohorts available.</div>
                        }
                    </List>
                    <List>
                    <Subheader>Select Course Cohort</Subheader>

                    {this.state.courseCohorts
                            ?
                            <PaginationCohorts
                                data={this.state.courseCohorts}
                            >
                                <PaginationListCohorts
                                    handleChangeCohortCheckbox={this.handleChangeCohortsCheckbox}
                                    selectedCohorts={this.state.selectedCohorts}
                                    handleSelectAllCohorts={this.handleSelectAllCohorts}
                                />
                            </PaginationCohorts>
                            :
                            <div> No cohorts available.</div>
                        }
                    </List>
                </div>
                /*:
                <CircularProgress size={60} thickness={7} />*/
        ]
        const Step1 = [
            <Subheader key={"activity-settings-subheader"}>Activity Settings</Subheader>,
            QuestSettings,
            DateStartTime2,
            //  DateStartTime,
            //   DateEndTime
            ]
        const Step2 = [
            <Subheader>Select Tasks</Subheader>,
            <TaskPicker
                handleChange={this.handleChangeTasksCheckbox}
                selectedTasks={this.state.selectedTasks}
                handleChip={this.handleDeleteTasksChip}
                handleHomeworkChip={this.handleHomeworkChip}
                course_id={this.state.course_id}
                handleChangeCourse={this.handleChangeCourse}
                selectedHomework={this.state.selectedHomework}
                handleChangeHomework={this.handleChangeHomeworkCheckbox}
            />
        ]
        const Step3 = [
            SearchCohorts,
            Cohorts
        ]
        const Step4 = [
            <Subheader>Select Training Center</Subheader>,
            <TrainingCenterPicker
                handleChange={this.handleChangeTrainingCenterCheckbox}
                selectedTrainingCenter={this.state.training_center_id}
                selectedResources={this.state.selectedTrainingCenterResources}
                handleChip={this.handleDeleteTrainingCenterChip}
                course_id={this.state.course_id}
                handleChangeTrainingCenter={this.handleChangeTrainingCenter}
            />
        ]
        const Notification = [
            <div>
                <Subheader>Notifications</Subheader>
                <div style={{ marginLeft: 20 }}>
                    <div style={{ display: "flex" }}>
                        <div>
                            <br />
                            <span>Send message to Students (off/on)</span>
                        </div>
                        <div style={styles.gridKey2}>
                            <Toggle
                                toggled={this.state.sendMessage}
                                onToggle={this.handleSendMessageToggle}
                            />
                            <br />
                            <br />
                        </div>
                    </div>
                    {this.state.sendMessage ?
                        <div>
                            <br />
                            <Divider />
                            <div>
                                <br />
                                <span>Message to send:</span>
                            </div>
                            <div >
                                <TextField
                                    name="prereq"
                                    onChange={this.handleChangeMessageBody}
                                    floatingLabelText="Text"
                                    value={this.state.messageBody}
                                    multiLine={true}
                                    rows={1}
                                    rowsMax={5}
                                    fullWidth={true}
                                />
                                {/* <FlatButton label="Send Test" style={{ margin: 1 }} onClick={this.postMessages} /> */}

                            </div>
                        </div>
                        : <div></div>}
                </div>
            </div>
        ]
        const Step5 = [
            Notification
        ]
        if (status === "success" && questResponse !== null) {
            var redirectTo = "/planning";
            this.postMessages();

            dispatch(questsActions.clearCreateQuest());
            return (
                <Redirect to={redirectTo} />
            )
        }
        else {
            return (
                <div style={{ display: "flex", justifyContent: "center" }}>
                    <br />
                    <Paper key="quest-paper" className={"edtx-paper"} style={{ zDepth: 2 }}>
                        <div style={{ display: "flex", width: "100%", alignItems: "center" }}>
                            <div style={{ flex: 1 }}>
                                <FlatButton label="Go Back" onClick={this.goBack} />
                            </div>
                            <div key="grade-div-container" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                                <h1>Create new Activity</h1>
                            </div>
                            <div style={{ flex: 1 }}></div>
                        </div>
                        {/* <h2>Create new Activity</h2> */}
                        <QuestStepper
                            key="quest-stepper"
                            form1={Step1}
                            form2={Step2}
                            form3={Step3}
                            form4={Step4}
                            form5={Step5}
                            submit={this.submit}
                            reset={this.resetState}
                            resetDisabled={this.state.resetDisabled}
                            submitDisabled={this.state.submitDisabled}
                            status={this.props.status}
                        />
                    </Paper>
                </div>
            )
        }
    }
}
function mapStateToProps(state) {
    const { alert } = state;
    const { status, questResponse } = state.createQuest;
    const { students, fetching } = state.students;
    return {
        status,
        alert,
        questResponse,
        students, fetching,
    };
}
const connectedQuestList = connect(mapStateToProps)(CreateQuest);
export { connectedQuestList as CreateQuest };
