import { TextField } from 'material-ui';
import Chip from 'material-ui/Chip';
import CircularProgress from 'material-ui/CircularProgress';
import DatePicker from 'material-ui/DatePicker';
import { GridList, GridTile } from 'material-ui/GridList';
import { List } from 'material-ui/List';
import Paper from 'material-ui/Paper';
import Subheader from 'material-ui/Subheader';
import moment from 'moment';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router';
import { alertActions, questsActions, studentsActions } from '../../actions';
import { Pagination, PaginationListItems } from './Pagination';
import GranularControlStepper from './QuestStepper';
import { TaskPicker } from './TaskPicker';
import { TrainingCenterPicker } from './TrainingCenterPicker';
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
        date: undefined,
        end_date: undefined,
        selectedTasks: [],
        selectedCohorts: [],
        cohorts: [],
        traning_center_resources: [],
        other_resources: [],
        resetDisabled: true,
        submitDisabled: true,
        open: false,
        taskNames: [],
        course_id: 1,
        training_center_id: 1,
        selectedTrainingCenterResources: [],
        selectedHomework: [],
        cohortType: "ALL",
        searchUsername: undefined,
        searchCohortGroup: undefined,
    };
};
class EditQuest extends Component {
    constructor(props) {
        super(props);
        this.state = getInitialState();
    }
    componentWillMount() {
        const { dispatch, location } = this.props;
        this.questID = location.pathname.split('/')[2];
        dispatch(questsActions.getQuestDetails(this.questID));
        dispatch(studentsActions.getStudents());
    }
    componentWillReceiveProps(nextProps) {
        if (!this.isEmpty(nextProps.quest)) {
            var filteredStudents = this.state.cohorts;
            if (!this.isEmpty(nextProps.students)) {
                // filteredStudents = this.filterStudents(nextProps.students);
                if (this.state.cohortType !== "ALL") {
                    filteredStudents = filteredStudents.filter(s => s.country === this.state.cohortType)
                }
                if (this.state.searchUsername !== undefined) {
                    filteredStudents = filteredStudents.filter(s => s.name.toLowerCase().includes(this.state.searchUsername.toLowerCase()))
                }
            }
            var selectedTasksModified = nextProps.quest.group.tasks.map(t => {
                t.section_url = t.task;
                return t
            })
            var selectedTasks = selectedTasksModified.filter(t => t.homework === false)
            var selectedHomework = selectedTasksModified.filter(t => t.homework === true)
            
            
            this.setState({
                name: nextProps.quest.name ? nextProps.quest.name : nextProps.quest.comment,
                date: nextProps.quest.date,
                end_date: nextProps.quest.end_date,
                selectedTasks: selectedTasks,
                selectedHomework: selectedHomework,
                // selectedTasks: nextProps.quest.group.tasks,
                selectedCohorts: nextProps.quest.cohort.users,
                course_id: nextProps.quest.group ? nextProps.quest.group.course_id : undefined,
                center: nextProps.quest.center ? nextProps.quest.center.id : undefined,
                traning_center_resources: nextProps.quest.traning_center_resources,
                other_resources: nextProps.quest.other_resources,
                cohorts: filteredStudents
            })
        }
    }
    // filterStudents = (students) => {
    //     var filteredStudents = students;
    //     if (this.state.cohortType !== "ALL") {
    //         filteredStudents = filteredStudents.filter(s => s.country === this.state.cohortType)
    //     }
    //     if (this.state.searchUsername !== undefined) {
    //         filteredStudents = filteredStudents.filter(s => s.name.toLowerCase().includes(this.state.searchUsername.toLowerCase()))
    //     }
    //     return this.filterStudents;
    //     // this.setState({ cohorts: filteredStudents })
    // }
    submit = values => {
        const { dispatch } = this.props;
        if (this.state.name === undefined) {
            dispatch(alertActions.error("Not all required fields filled in."));
        } else {
            var centerId = this.state.training_center_id === 1 ? undefined : this.state.training_center_id;
            var questData = {
                comment: this.state.name,
                cohort: this.state.selectedCohorts.map((e) => {
                    return e.username
                }),
                date: this.state.date ? moment(this.state.date).format() : "",
                end_date: this.state.end_date ? moment(this.state.end_date).format() : "",
                // tasks: this.state.selectedTasks.map((e) => {
                //     return e.task
                // }),
                tasks: this.state.selectedTasks.map(e => e.task) || [],
                homework_tasks: this.state.selectedHomework.map(e => e.task)  || [],
                center: centerId,
                traning_center_resources: this.state.selectedTrainingCenterResources.map(e => e.id),
                other_resources: this.state.other_resources
            };
            
            dispatch(questsActions.updateQuestById(this.questID, questData));
        }
    }
    resetState = () => {
        //TODO: not resetting Cohorts properly
        var initialState = getInitialState();
        this.setState(initialState);
        this.props.dispatch(studentsActions.getStudents());
    };
    handleChangeQuestName = (event, value) => {
        this.setState({
            name: value,
            resetDisabled: false,
            submitDisabled: false,
        });
    };
    handleDateStart = (event, value) => {
        this.setState({
            date: value,
            resetDisabled: false,
            submitDisabled: false,
        })
    };
    handleDateEnd = (event, value) => {
        this.setState({
            end_date: value.toString(),
            resetDisabled: false,
            submitDisabled: false,
        })
    };
    handleChangeTasksCheckbox = (event, checked, value) => {
        
        var currentTasks = this.state.selectedTasks;
        if (checked) {
            currentTasks.push(value);
        } else {
            var index = currentTasks.map((e) => {
                return e.section_url
            }).indexOf(value.section_url);
            if (index > -1) {
                currentTasks.splice(index, 1);
            }
        }
        this.setState({
            selectedTasks: currentTasks,
            resetDisabled: false,
            submitDisabled: false,
        });
    }
    handleDeleteTasksChip = (value) => {
        var currentTasks = this.state.selectedTasks;
        var index = currentTasks.map((e) => {
            return e.section_url
        }).indexOf(value.section_url);
        if (index > -1) {
            currentTasks.splice(index, 1);
        }
        this.setState({
            selectedTasks: currentTasks,
            resetDisabled: false,
            submitDisabled: false,
        });
    }
    handleChangeCohortCheckbox = (event, checked, value) => {
        var currentCohorts = this.state.selectedCohorts;
        var index = currentCohorts.map((e) => {
            return e.id
        }).indexOf(value.id);
        if (checked) {
            if (index === -1) {
                currentCohorts.push(value);
            }
        } else {
            if (index > -1) {
                currentCohorts.splice(index, 1);
            }
        }
        this.setState({
            selectedCohorts: currentCohorts,
            resetDisabled: false,
            submitDisabled: false,
        });
    }
    isEmpty = (obj) => {
        for (var key in obj) {
            if (obj.hasOwnProperty(key))
                return false;
        }
        return true;
    }
    handleOpen = () => {
        this.setState({ open: true });
    }
    handleClose = () => {
        this.setState({ open: false });
    }
    handleChangeCourse = (value) => {
        this.setState({
            course_id: value,
            resetDisabled: false,
            submitDisabled: false,
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
    
    renderCohortChip(cohort) {
        return (
            <Chip
                key={cohort.id}
                onRequestDelete={() => {
                    this.handleChangeCohortCheckbox(null, false, cohort);
                    this.forceUpdate()
                }}
                style={styles.chip}
            >
                {cohort.first_name && cohort.last_name ? cohort.first_name + " " + cohort.last_name : cohort.name}
            </Chip>
        );
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
    handleGoBack = () => {
        
        this.props.history.goBack();
    };
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
    handleChangeHomeworkCheckbox = (event, checked, task) => {
        var currentTasks = this.state.selectedTasks;
        var currentHomeworkTasks = this.state.selectedHomework;
        if (checked) {
            currentHomeworkTasks.push(task);
            var index = currentTasks.map((e) => {
                return e.section_url
            }).indexOf(task.section_url);
            if (index > -1) {
                currentTasks.splice(index, 1);
            }
        }
        else {
            currentTasks.push(task);
            var index2 = currentHomeworkTasks.map((e) => {
                return e.section_url
            }).indexOf(task.section_url);
            if (index2 > -1) {
                currentHomeworkTasks.splice(index2, 1);
            }
        }
        this.setState({
            selectedHomework: currentHomeworkTasks,
            selectedTasks: currentTasks,
            resetDisabled: false,
        });
    }
    handleSelectAllCohorts = (event, checked) => {
        
        var newSelectedCohorts = []
        if (checked) {
            var allCohorts = this.props.students;
            
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
    searchStudents = () => {
        this.props.dispatch(studentsActions.getStudents(this.state.searchUsername, this.state.searchCohortGroup))
    }
    handleClearSearch = (event, value) => {
        this.setState({
            searchUsername: undefined,
            searchCohortGroup: undefined
        });
        this.searchStudents();
    }
    handleKeyPress = (event) => {
        if(event.key === 'Enter'){
          this.searchStudents();
        }
    }
    render() {
        const { status, updateQuestResponse, dispatch, fetching } = this.props;
        var startDate = this.props.quest.date ? new Date(this.props.quest.date) : undefined;
        var endDate = this.props.quest.end_date ? new Date(this.props.quest.end_date) : undefined;
        const DateStart = [
            <GridList className="syncGrid" cellHeight={80} cols={3}>
                <GridTile style={styles.gridKey}>
                    <span className="syncLabel">Start Date</span>
                </GridTile>
                <GridTile cols={2}>
                    {startDate ?
                        <DatePicker
                            id={"date"}
                            hintText="Pick a date."
                            autoOk={true}
                            onChange={this.handleDateStart}
                            defaultDate={startDate}
                        />
                        : <br />
                    }
                </GridTile>
            </GridList>
        ];
        const DateEnd = [
            <GridList className="syncGrid" cellHeight={80} cols={3}>
                <GridTile style={styles.gridKey}>
                    <span className="syncLabel">End Date</span>
                </GridTile>
                <GridTile cols={2}>
                    {endDate ?
                        <DatePicker
                            id={"end_date"}
                            hintText="Pick a date."
                            autoOk={true}
                            onChange={this.handleDateEnd}
                            defaultDate={endDate}
                        />
                        : <br />
                    }
                    {this.props.quest.end_date} {this.state.end_date} {this.state.name}
                </GridTile>
            </GridList>
        ];
        const QuestSettings = [
            <GridList className="syncGrid" cellHeight={80} cols={3}>
                <GridTile style={styles.gridKey}>
                    <span className="syncLabel">Quest Name</span>
                </GridTile>
                <GridTile cols={2}>
                    <TextField name="name" onChange={this.handleChangeQuestName} hintText="Quest Name"
                        value={this.state.name} />
                </GridTile>
            </GridList>
        ];
        const SearchCohorts = [
            <div style={styles.root}>
                <GridList style={{ paddingLeft: "16px" }} className="syncGrid" cellHeight={80} cols={3}>
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
                    <GridTile style={styles.gridKey}>
                        {/* <span className="syncLabel">Filter</span> */}
                    </GridTile>
                    <GridTile cols={2}>
                        {/* <DropDownMenu name={"filter"} style={{ align: "left", paddingLeft: "0 !important" }} value={this.state.cohortType} onChange={this.handleChangeChortType} >
                            <MenuItem value={"SE"} primaryText="SE" />
                            <MenuItem value={"US"} primaryText="US" />
                            <MenuItem value={"ALL"} primaryText="All" />
                        </DropDownMenu> */}
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
            !fetching ?
                <div style={styles.root}>
                    <List>
                        <Subheader>Select Cohorts</Subheader>
                        {!this.isEmpty(this.state.selectedCohorts)
                            ?
                            <div style={styles.wrapper}>
                                {this.state.selectedCohorts.map(this.renderCohortChip, this)}
                            </div>
                            : null
                        }
                        {this.props.students
                            ?
                            <Pagination
                                data={this.props.students}
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
                </div>
                :
                <CircularProgress size={60} thickness={7} />
        ];
        const Step1 = [QuestSettings, DateStart, DateEnd]
        const Step2 = [<TaskPicker
            handleChange={this.handleChangeTasksCheckbox}
            selectedTasks={this.state.selectedTasks}
            handleChip={this.handleDeleteTasksChip}
            course_id={this.state.course_id}
            handleChangeCourse={this.handleChangeCourse}

            handleHomeworkChip={this.handleHomeworkChip}
            selectedHomework={this.state.selectedHomework}
            handleChangeHomework={this.handleChangeHomeworkCheckbox}
        />]
        const Step3 = [SearchCohorts, Cohorts]
        const Step4 = [
            <TrainingCenterPicker
                handleChange={this.handleChangeTrainingCenterCheckbox}
                selectedTrainingCenter={this.state.training_center_id}
                selectedResources={this.state.selectedTrainingCenterResources}
                handleChip={this.handleDeleteTrainingCenterChip}
                course_id={this.state.course_id}
                handleChangeTrainingCenter={this.handleChangeTrainingCenter}
            />
        ]
        const Header = [
            <div style={{ display: "flex", width: "100%", alignItems: "center" }}>
                <div style={{ flex: 1 }}>
                    {/* <NavLink to={"/review/"} key={"back-review"}> */}
                    <FlatButton label="Go back" onClick={this.handleGoBack} />
                    {/* </NavLink> */}
                </div>
                <div key="grade-div-container" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                    <h2 style={{
                        width: "100%",
                        fontSize: "2em",
                        padding: "0 0.3em 0.3em 0.3em"
                    }}>Edit Activity</h2>
                </div>
                <div style={{ flex: 1 }}></div>
            </div>
        ]
        if (status === "success" && updateQuestResponse !== null) {
            var redirectTo = "/planning";
            dispatch(questsActions.clearUpdateQuest());
            return (
                <Redirect to={redirectTo} />
            )
        }
        else {
            return (
                <div style={{ display: "flex", justifyContent: "center" }}>
                    <br />
                    <Paper className={"edtx-paper"} style={{ zDepth: 2 }}>
                        {Header}
                        {/* <h2>Edit Activity</h2> */}
                        {fetching ?
                            <CircularProgress size={60} thickness={7} />
                            :
                            <GranularControlStepper
                                form1={Step1}
                                form2={Step2}
                                form3={Step3}
                                form4={Step4}
                                submit={this.submit}
                                reset={this.resetState}
                                resetDisabled={this.state.resetDisabled}
                                submitDisabled={this.state.submitDisabled}
                                type="Edit"
                            />
                        }
                    </Paper>
                </div>
            )
        }
    }
}
function mapStateToProps(state) {
    const { students } = state.students;
    const { fetching, quest } = state.questDetails;
    const { status, updateQuestResponse } = state.updateQuest;
    return {
        fetching,
        quest,
        status,
        updateQuestResponse,
        students
    };
}
const connectedQuest = connect(mapStateToProps)(EditQuest);
export { connectedQuest as EditQuest };