import Paper from 'material-ui/Paper';
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Redirect} from 'react-router';

import {coursesActions} from '../../actions';
import SyncValidationForm from '../SyncValidationForm';

import {namingConstants} from '../../constants';

class CreateCourse extends Component {
    constructor(props) {
        super(props)
        this.state = {
            course_name: "",
            course_organization: "",
            course_number: "",
            course_run: "",
        };
    }

    submit = values => {
        const {dispatch} = this.props;

        dispatch(coursesActions.createCourse(values));

    }
    handleCancel = () => {
        this.props.history.goBack();
    }

    render() {
        const {status, courseResponse, dispatch} = this.props;
        const fields = [
            {
                name: "course_name",
                label: namingConstants.COURSE + " Name",
                floatLabel: "e.g. " + namingConstants.COURSE + " name"
            },
            {name: "organization", label: "Organization", floatLabel: "e.g. OrganizationX"},
            {name: "number", label: namingConstants.COURSE + "  Number", floatLabel: "e.g. CS101"},
            {name: "run", label: namingConstants.COURSE + " Run", floatLabel: "e.g. 2018_Q1"}
        ];

        if (status === "success" && courseResponse !== null) {
            
            var redirectTo = "/courses";
            if (courseResponse.course_key !== undefined) {
                redirectTo = "/courses/" + courseResponse.course_key;
            }
            dispatch(coursesActions.clearCreateCourse());
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
                        <SyncValidationForm onSubmit={this.submit} onCancel={this.handleCancel} fields={fields}/>
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
