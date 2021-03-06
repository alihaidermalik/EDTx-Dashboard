import { studentsConstants } from '../constants';
import { cohortsConstants } from '../constants/cohortsConstants';
import { studentsService } from '../services';
import { alertActions, userActions } from './';


export const studentsActions = {
    getStudents,
    getCohorts,
};

function getStudents(username = undefined, cohortGroup = undefined) {  
    return dispatch => {
        dispatch(request());

        studentsService.getStudents(username, cohortGroup)
            .then(
                students => {
                    dispatch(success(students));
                    return students
                },
                error => {
                    dispatch(failure(error));
                    if (error.response !== undefined) {

                        if (error.response.status === 401) {
                            dispatch(userActions.logout());
                        }
                        dispatch(alertActions.error(error.response.data.error ? error.response.data.error : error));
                    } else {
                        dispatch(alertActions.error("Internal server error, no response from server."));
                    }
                }
            );
    };

    function request() { return { type: studentsConstants.GETSTUDENTS_REQUEST } }
    function success(students) { return { type: studentsConstants.GETSTUDENTS_SUCCESS, students } }
    function failure(error) { return { type: studentsConstants.GETSTUDENTS_FAILURE, error } }
}

function getCohorts(course = undefined) {  
    return dispatch => {
        dispatch(request());

        studentsService.getCohorts(course)
            .then(
                cohorts => {
                    dispatch(success(cohorts));
                    return cohorts
                },
                error => {
                    dispatch(failure(error));
                    if (error.response !== undefined) {

                        if (error.response.status === 401) {
                            dispatch(userActions.logout());
                        }
                        dispatch(alertActions.error(error.response.data.error ? error.response.data.error : error));
                    } else {
                        dispatch(alertActions.error("Internal server error, no response from server."));
                    }
                }
            );
    };

    function request() { return { type: cohortsConstants.GETCOHORTS_REQUEST } }
    function success(students) { return { type: cohortsConstants.GETCOHORTS_SUCCESS, students } }
    function failure(error) { return { type: cohortsConstants.GETCOHORTS_FAILURE, error } }
}