import CircularProgress from 'material-ui/CircularProgress';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router';

import { coursesActions } from '../../actions';
import EditCourseImage from './EditCourseImage';
import EditCourseText from './EditCourseText';
import EditDetail from './EditDetail';
import EditCourseDescription from './EditCourseDescription';
import EditCourseLanguage from './EditCourseLanguage';
import { GridList, GridTile } from 'material-ui/GridList';
import DateTimeComponent from './DateTimeComponent';
import FlatButton from 'material-ui/FlatButton';

const styles = theme => ({
    submitButton: {
        margin: 12,
    }
});


class EditCourse extends Component {
    constructor(props) {
        super(props)
        this.courseID = null;

        this.state = {
            course_name: "",
            course_organization: "",
            course_number: "",
            course_run: "",
            course_language: "English",
            skillDescriptionText: "",
            skillOverviewText: "",
            skillDetailsText: "",
            skillImage: "",
            skillVideo: ""

        };

    }

    componentWillMount() {
        const { dispatch } = this.props;
        this.courseID = this.props.location.pathname.split('/')[2];

        dispatch(coursesActions.getCourseDetails(this.courseID));
        dispatch(coursesActions.getCourseTasktree(this.courseID)); //behövs för breadcrumbs?

    }


    componentWillReceiveProps(nextProps) {

        if (this.isEmpty(nextProps.deets)) {
        } else {
            var parts = nextProps.deets.id.split("+");
            var runText = parts[parts.length - 1];

            this.setState({
                course_name: nextProps.deets.name,
                course_organization: nextProps.deets.org,
                course_number: nextProps.deets.number,
                course_run: runText,
                skillDescriptionText: nextProps.deets.short_description,
                skillOverviewText: nextProps.deets.overview,
                skillImage: nextProps.deets.media.course_image.uri
            });
        }
    }

    handleSubmit = (e) => {
        // TODO: add name, organization, number and run to courseData
        e.preventDefault();
        const { dispatch } = this.props;
        const {
            skillDescriptionText,
            skillOverviewText,

            skillImage
        } = this.state;
        const courseID = this.courseID;

        var courseData = {
            course_id: courseID,
            short_description: skillDescriptionText,
            overview: skillOverviewText,
            course_image_name: skillImage,
            intro_video: null,
            start_date: "2030-01-01T00:00:00Z"
        }

        dispatch(coursesActions.updateCourseById(courseID, courseData));

    };
    handleLanguageChange = (event, index, values) => this.setState({ language: values });



    handleChange = (event) => {
        //TODO: add
    }
    handleSelectChange = (event, index, values) => this.setState({ values });

    handleInputChange = (event) => {
        const target = event.target;
        const value = target.value;
        const name = target.name;

        this.setState({
            [name]: value
        });
    };

    isEmpty = (obj) => {
        for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
                return false;
            }
        }
        return true;
    };

    handleDescriptChange = (value) => {
        this.setState({ skillDescriptionText: value });
    };

    handleOverviewChange = (value) => {
        this.setState({ skillOverviewText: value });
    };
    handleDetailsChange = (value) => {
        this.setState({ skillDetailsText: value });
    };
    handleImageChange = (value) => {
        this.setState({ skillImage: value });
    };
    handlelVideochange = (value) => {
        this.setState({ skillVideo: value });
    };
    goBack = () => {
        this.props.history.goBack();
    }
    render() {
        const {
            dispatch,
            deets,
            status,
            updateCourseResponse
        } = this.props;
        const {

            course_organization,
            course_run,
            course_number,
            course_language
        } = this.state;


        //TODO: make these into stateless components
        const RequirementsSettings = [
            <GridList className="syncGrid" cellHeight={80} cols={3}>
                <GridTile style={styles.gridKey}>
                    <span className="syncLabel">Knowledge or certificate needed</span>
                </GridTile>
                <GridTile cols={2}>
                    <TextField name="prereq" onChange={this.handleChange} hintText="True/False"
                        value={this.state.prereq} />
                </GridTile>
                <GridTile style={styles.gridKey}>
                    <span className="syncLabel">Estimated number of Hours</span>
                </GridTile>
                <GridTile cols={2}>
                    <TextField name="est_hours" onChange={this.handleChange} hintText="Location"
                        value={this.state.est_hours} />
                </GridTile>
                <GridTile style={styles.gridKey}>
                    <span className="syncLabel">Details</span>
                </GridTile>
                <GridTile cols={2}>
                    <TextField name="details" onChange={this.handleChange} hintText="Location"
                        value={this.state.details} />
                </GridTile>
            </GridList>
        ]
        var scheduleExtras = [
            <DateTimeComponent name="time_start" title="Start Date" value={this.state.time_start}
                onChange={this.handleDateStart} id="time_start" />,
            <DateTimeComponent name="time_end" title="End Date" value={this.state.time_end}
                onChange={this.handleDateEnd} id="time_end" />,
            <DateTimeComponent name="enrollment_start" title="Open for enrollment" value={this.state.enrollment_start}
                onChange={this.handleEnrollmentStart} id="enrollment_start" />,
            <DateTimeComponent name="enrollment_end" title="Close for enrollment" value={this.state.enrollment_end}
                onChange={this.handleEnrollmentEnd} id="enrollment_end" />
        ];

        if (this.isEmpty(deets)) {
            //TODO: make loading of page better / nicer
            //TODO: stop submit if short description is over 150 characters
            return (
                <div style={{ display: "flex", justifyContent: "center" }}>
                    <br />
                    <Paper className={"edtx-paper"} style={{ zDepth: 2 }}>
                        <div>
                            <CircularProgress size={60} thickness={7} />
                        </div>
                    </Paper>
                </div>
            )
        } else {

            if (status === "success" && updateCourseResponse !== null) {

                var redirectTo = "/courses";
                if (this.courseID !== undefined) {
                    redirectTo = "/courses/" + this.courseID;
                }
                dispatch(coursesActions.clearUpdateCourse());
                return (
                    <Redirect to={redirectTo} />
                )
            } else {
                return <div style={{ display: "flex", justifyContent: "center" }}>
                    <br />
                    <Paper className={"edtx-paper"} style={{ zDepth: 2 }}>
                        <div style={{ display: "flex", width: "100%", alignItems: "center" }}>
                            <div style={{ flex: 1 }}>
                                <FlatButton label="Go Back" onClick={this.goBack} />
                            </div>
                            <div key="grade-div-container" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                                <h1>Edit {this.state.course_name}</h1>
                            </div>
                            <div style={{ flex: 1 }}></div>
                        </div>
                        <form className="edit-course-form" onSubmit={this.handleSubmit}>
                            <h3>Chapter</h3>
                            <EditDetail name="course_organization" value={course_organization}
                                onChange={this.handleInputChange} title="Organization" />
                            <EditDetail name="course_number" value={course_number} onChange={this.handleInputChange}
                                title="Number" />
                            <EditDetail name="course_run" value={course_run} onChange={this.handleInputChange}
                                title="Run" />
                            <hr />
                            <h3>Details</h3>
                            <EditCourseLanguage name="course-language" value={course_language} title="Language" />
                            <EditCourseText name="skillOverviewText" title="Overview"
                                value={this.state.skillOverviewText} onChange={this.handleOverviewChange} />
                            <EditCourseDescription name="skillDescriptionText" maxlen={150}
                                value={this.state.skillDescriptionText}
                                onChange={this.handleInputChange} />
                            <EditCourseText name="skillDetailsText" title="Details" value={this.state.skillDetailsText}
                                onChange={this.handleDetailsChange} />
                            <EditCourseImage name="skillImage" title="Card Image" value={this.state.skillImage}
                                onChange={this.handleImageChange} />
                            <EditCourseImage name="skillVideo" title="Introduction Video" value={this.state.skillVideo}
                                onChange={this.handleVideoChange} />
                            <hr />
                            <h3>Requirements</h3>
                            {RequirementsSettings}
                            <hr />
                            <h3>Schedule</h3>
                            {scheduleExtras}

                            <br />
                            <RaisedButton label="Submit" style={styles.submitButton} onClick={this.handleSubmit}
                                backgroundColor={"#364D7C"} labelColor="#fff" />

                        </form>
                    </Paper>
                </div>;
            }
        }
    }


}


function mapStateToProps(state) {
    const { status, updateCourseResponse } = state.updateCourse;
    const { alert } = state;

    const { deets } = state.deetss;
    return {
        alert,
        status,
        updateCourseResponse,
        deets,
    };
}

const connectedCourseList = connect(mapStateToProps)(EditCourse);
export { connectedCourseList as EditCourse };
