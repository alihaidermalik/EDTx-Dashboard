import Paper from 'material-ui/Paper';
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Redirect} from 'react-router';
import {coursesActions} from '../../actions';
import {namingConstants} from '../../constants';
import {GridList, GridTile} from 'material-ui/GridList';
import Toggle from 'material-ui/Toggle';
import EditCourseImage from './EditCourseImage';
import EditCourseText from './EditCourseText';
import EditCourseDescription from './EditCourseDescription';
import EditCourseLanguage from './EditCourseLanguage';
import CourseStepper from './CourseStepper';
import TextField from 'material-ui/TextField';
import {alertActions} from '../../actions';
import DateTimeComponent from './DateTimeComponent';
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';
const styles = {
    gridKey: {
        textAlign: "right",
        paddingRight: "38px",
        overflow: "hidden"
    },
    btnWrapper: {
        width: "40%",
        display: "flex",
        paddingTop: "42px",
        marginLeft: "11%"
    },
    gridKey2: {
        textAlign: "left",
        paddingRight: "38px",
        overflow: "hidden",
        display: 'flex',
        alignItems: 'center'
    },
    radioButton: {
        marginBottom: 5,
      },
};
const getInitialState = () => {
    return {
        course_name: "",
        organization: "",
        number: "",
        run: "",
        category: "Fire fighting",
        time_start: undefined,
        time_end: undefined,
        enrollment_start: undefined,
        enrollment_end: undefined,
        course_language: "English",
        skillDescriptionText: "",
        skillOverviewText: "",
        skillDetailsText: "",
        skillImage: "",
        skillVideo: "",
        resetDisabled: true,
        submitDisabled: true,
        autoNumbering: false,
        language: "English",
        prereq: "",
        est_hours: "",
        details: ""
    };
};
class CreateCourse extends Component {
    constructor(props) {
        super(props)
        this.state = getInitialState();
    }
    componentWillUpdate(nextProps, nextState) {
        nextState.submitDisabled = !(nextState.course_name !== "" && nextState.organization !== "" && nextState.number !== "" && nextState.run !== "");
    }
    submit = values => {
        const {dispatch} = this.props;
        if (this.state.course_name === undefined || this.state.organization === undefined) {
            dispatch(alertActions.error("Not all required fields filled in."));
        } else {
            var courseData = {
                course_name: this.state.course_name,
                organization: this.state.organization,
                number: this.state.number,
                run: this.state.run,
            };
            var courseEditData = {
                course_id: "",
                short_description: this.state.skillDescriptionText,
                overview: this.state.skillOverviewText,
                course_image_name: this.state.skillImage,
                intro_video: this.state.skillVideo,
                start_date: "2030-01-01T00:00:00Z"
            }
            dispatch(coursesActions.createAndEditCourse(courseData, courseEditData))
        }
    }
    resetState = () => {
        var initialState = getInitialState();
        this.setState(initialState);
    }
    handleChange = (event) => {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        this.setState({
            [name]: value,
            resetDisabled: false,
        });
    };
    handleCancel = () => {
        this.props.history.goBack();
    }
    handleCategoryChange = (event, index, values) => this.setState({category: values});
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
    handleEnrollmentStart = (event, date) => {
        this.setState({
            enrollment_start: date,
            resetDisabled: false,
        })
    }
    handleEnrollmentEnd = (event, date) => {
        this.setState({
            enrollment_end: date,
            resetDisabled: false,
        })
    }
    handleAutoNumberingToggle = (event, value) => {
        this.setState({
            autoNumbering: value,
            resetDisabled: false,
        })
    }
    handleDescriptChange = (value) => {
        this.setState({skillDescriptionText: value});
    };
    handleOverviewChange = (value) => {
        this.setState({skillOverviewText: value});
    };
    handleDetailsChange = (value) => {
        this.setState({skillDetailsText: value});
    };
    handleImageChange = (event, value) => {
        this.setState({skillImage: value});
    };
    handleVideoChange = (event, value) => {
        this.setState({skillVideo: value});
    };
    handleChangeRadio = (event, value) => {
            this.setState({
                category: value,
                commentOpen : false
            })
    }
    render() {
        const {status, courseResponse, dispatch} = this.props;
        const radios = [
            <RadioButton
              key={"fire-rbtn"}
              value={"Fire fighting"}
              label={"Fire fighting"}
              style={styles.radioButton}
              onClick={(e)=>{e.stopPropagation()}}
            />,
            <RadioButton
              key={"ambulance-rbtn"}
              value={"Ambulance"}
              label={"Ambulance"}
              style={styles.radioButton}
              onClick={(e)=>{e.stopPropagation()}}
            />,
        ];
        const categoryRadio = [(
            <GridList className="syncGrid" cellHeight={80} cols={3}>
                <GridTile style={styles.gridKey}>
                    <span className="syncLabel">Category</span>
                </GridTile>
                <GridTile cols={2} name="xxxx" style={styles.gridKey2}>
                    {/* <DropDownMenu styles={{align: "left", "padding-left": "0 !important"}} value={this.state.category}
                                  onChange={this.handleCategoryChange}>
                        <MenuItem value={"Fire fighting"} primaryText="Fire fighting"/>
                        <MenuItem value={"Police"} primaryText="Police"/>
                        <MenuItem value={"Ambulance"} primaryText="Ambulance"/>
                        <MenuItem value={"Health and Safety"} primaryText="Health and Safety"/>
                        <MenuItem value={"Environment"} primaryText="Environment"/>
                        <MenuItem value={"Maintenance"} primaryText="Maintenance"/>
                    </DropDownMenu> */}
                    <RadioButtonGroup name="rbg-category-component"
                        valueSelected={this.state.category}
                        onChange={this.handleChangeRadio}
                        style={{width : "250px"}}
                    >
                        {radios}
                    </RadioButtonGroup>
                </GridTile>
            </GridList>
        )];
        const autoNumberingToggle = [(
            <GridList className="syncGrid" cellHeight={80} cols={3}>
                <GridTile style={styles.gridKey}>
                    <span className="syncLabel">Auto Numbering (off/on)</span>
                </GridTile>
                <GridTile cols={2} style={styles.gridKey2}>
                    <Toggle
                        toggled={this.state.autoNumbering}
                        onToggle={this.handleAutoNumberingToggle}
                    />
                </GridTile>
            </GridList>
        )];
        const ChapterSettings = [
            <GridList className="syncGrid" cellHeight={80} cols={3}>
                <GridTile style={styles.gridKey}>
                    <span className="syncLabel">{namingConstants.COURSE + " Name"}</span>
                </GridTile>
                <GridTile cols={2}>
                    <TextField name="course_name" onChange={this.handleChange} hintText="Required field."
                               value={this.state.course_name}/>
                </GridTile>
                <GridTile style={styles.gridKey}>
                    <span className="syncLabel">Organization</span>
                </GridTile>
                <GridTile cols={2}>
                    <TextField name="organization" onChange={this.handleChange} hintText="Required field."
                               value={this.state.organization}/>
                </GridTile>
                <GridTile style={styles.gridKey}>
                    <span className="syncLabel">{namingConstants.COURSE + " number"}</span>
                </GridTile>
                <GridTile cols={2}>
                    <TextField name="number" onChange={this.handleChange} hintText="Required field."
                               value={this.state.number}/>
                </GridTile>
                <GridTile style={styles.gridKey}>
                    <span className="syncLabel">{namingConstants.COURSE + " run"}</span>
                </GridTile>
                <GridTile cols={2}>
                    <TextField name="run" onChange={this.handleChange} hintText="Required field."
                               value={this.state.run}/>
                </GridTile>
                <GridTile style={styles.gridKey}>
                    <span className="syncLabel">{namingConstants.COURSE + " summary"}</span>
                </GridTile>
                <GridTile cols={2}>
                    <TextField name="summary" onChange={this.handleChange} hintText="Brief summary."
                               value={this.state.summary}/>
                </GridTile>
            </GridList>
        ]
        const RequirementsSettings = [
            <GridList className="syncGrid" cellHeight={80} cols={3}>
                <GridTile style={styles.gridKey}>
                    <span className="syncLabel">Knowledge or certificate needed</span>
                </GridTile>
                <GridTile cols={2}>
                    <TextField name="prereq" onChange={this.handleChange} hintText="True/False"
                               value={this.state.prereq}/>
                </GridTile>
                <GridTile style={styles.gridKey}>
                    <span className="syncLabel">Estimated number of Hours</span>
                </GridTile>
                <GridTile cols={2}>
                    <TextField name="est_hours" onChange={this.handleChange} hintText="Hours"
                               value={this.state.est_hours}/>
                </GridTile>
                <GridTile style={styles.gridKey}>
                    <span className="syncLabel">Details</span>
                </GridTile>
                <GridTile cols={2}>
                    <TextField name="details" onChange={this.handleChange} hintText="Details"
                               value={this.state.details}/>
                </GridTile>
            </GridList>
        ]

        var detailExtras = [
            <EditCourseLanguage name="language" value={this.state.language} title="Language"
                                onChange={this.handleChange}/>,
            <EditCourseText name="skillOverviewText" title="Overview" value={this.state.skillOverviewText}
                            onChange={this.handleOverviewChange}/>,
            <EditCourseDescription name="skillDescriptionText" maxlen={150} value={this.state.skillDescriptionText}
                                   onChange={this.handleChange}/>,
            <EditCourseText name="skillDetailsText" title="Details" value={this.state.skillDetailsText}
                            onChange={this.handleDetailsChange}/>,
            <EditCourseImage name="skillImage" title="Card Image" value={this.state.skillImage}
                             onChange={this.handleChange}/>,
            <EditCourseImage name="skillVideo" title="Introduction Video" value={this.state.skillImage}
                             onChange={this.handleChange}/>,
        ];
        var requirementExtras = [
            <EditCourseImage title="Card Image"/>,
            <EditCourseImage title="Introduction Video"/>
        ];
        var scheduleExtras = [
            <DateTimeComponent name="time_start" title="Start Date" value={this.state.time_start}
                               onChange={this.handleDateStart} id="time_start"/>,
            <DateTimeComponent name="time_end" title="End Date" value={this.state.time_end}
                               onChange={this.handleDateEnd} id="time_end"/>,
            <DateTimeComponent name="enrollment_start" title="Open for enrollment" value={this.state.enrollment_start}
                               onChange={this.handleEnrollmentStart} id="enrollment_start"/>,
            <DateTimeComponent name="enrollment_end" title="Close for enrollment" value={this.state.enrollment_end}
                               onChange={this.handleEnrollmentEnd} id="enrollment_end"/>
        ];
        if (status === "success" && courseResponse !== null) {
            var redirectTo = "/courses";
            if (courseResponse.course_key !== undefined) {
                redirectTo = "/courses/" + courseResponse.course_key;
            }
            dispatch(coursesActions.clearCreateCourse());
            dispatch(coursesActions.clearUpdateCourse());
            return (
                <Redirect to={redirectTo}/>
            )
        }
        else {
            return (
                <div style={{display: "flex", justifyContent: "center"}}>
                    <br/>
                    <Paper className={"edtx-paper"} style={{ zDepth: 2 }}>
                        <h2>Create new {namingConstants.COURSE}</h2>
                        <CourseStepper
                            form1={
                                {
                                    name: "Chapter settings",
                                    content: [ChapterSettings, categoryRadio, autoNumberingToggle]
                                }
                            }
                            form2={
                                {
                                    name: "Detail settings",
                                    content: detailExtras
                                }
                            }
                            form3={
                                {
                                    name: "Requirement settings",
                                    content: [RequirementsSettings, requirementExtras]
                                }
                            }
                            form4={
                                {
                                    name: "Schedule settings",
                                    content: scheduleExtras
                                }
                            }
                            submit={this.submit}
                            reset={this.resetState}
                            resetDisabled={this.state.resetDisabled}
                            submitDisabled={this.state.submitDisabled}
                        />
                    </Paper>
                </div>
            )
        }
    }
}
function mapStateToProps(state) {
    const {alert} = state;
    const {status, courseResponse} = state.createCourse;
    return {
        status,
        alert,
        courseResponse
    };
}
const connectedCourseList = connect(mapStateToProps)(CreateCourse);
export {connectedCourseList as CreateCourse};
