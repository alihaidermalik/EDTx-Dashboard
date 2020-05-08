import { coursesConstants } from '../constants';
import { coursesService } from '../services';
import { alertActions, userActions } from './';
export const coursesActions = {
    getCourses,
    getCourseDetails,
    getCourseTasktree,
    getXBlockInfo,
    createCourse,
    getCourseById,
    updateCourseById,
    clearCreateCourse,
    clearUpdateCourse,
    createAndEditCourse
};
function getCourses() {
    return dispatch => {
        dispatch(request());
        coursesService.getCourses()
            .then(
                courses => {
                    dispatch(success(courses));
                    return courses
                },
                error => {
                    dispatch(failure(error));
                    if(error.response !== undefined){
                        if (error.response.status === 401 || (error.response.data.message && error.response.data.message === "Incorrect authentication credentials."))
                        {
                            dispatch(userActions.logout());
                        }
                        dispatch(alertActions.error(error.response.data.error ? error.response.data.error : error));
                    }else{
                        //TODO: ska nog logga up dig ändå
                        dispatch(alertActions.error("Internal server error. No response from server."))
                        dispatch(userActions.logout());
                    }
                }
            );
    };
    function request() { return { type: coursesConstants.GETCOURSES_REQUEST } }
    function success(courses) { return { type: coursesConstants.GETCOURSES_SUCCESS, courses } }
    function failure(error) { return { type: coursesConstants.GETCOURSES_FAILURE, error } }
}
function getCourseDetails(courseID) {
    return dispatch => {
        dispatch(request());
        coursesService.getCourseDetails(courseID)
            .then(
                deets => {
                    dispatch(success(deets));
                    return deets
                },
                error => {
                    dispatch(failure(error));
                    if (error.response.status === 401)
                    {
                        dispatch(userActions.logout());
                    }
                    dispatch(alertActions.error(error.response.data.error ? error.response.data.error : error));
                    
                }
            );
    };
    function request() { return { type: coursesConstants.GETCOURSEDETAILS_REQUEST } }
    function success(deets) { return { type: coursesConstants.GETCOURSEDETAILS_SUCCESS, deets } }
    function failure(error) { return { type: coursesConstants.GETCOURSEDETAILS_FAILURE, error } }
}
function getCourseTasktree(courseID) {
    return dispatch => {
        dispatch(request());
        coursesService.getCourseTasktree(courseID)
            .then(
                tasktree => {
                     dispatch(success(tasktree));
                    return tasktree
                },
                error => {
                    dispatch(failure(error));
                    if (error.response.status === 401 )//|| (error.message && error.message === "Incorrect authentication credentials."))
                    {
                        dispatch(userActions.logout());
                    }
                    dispatch(alertActions.error(error.response.data.error ? error.response.data.error : error));
                }
            );
    };
    function request() { return { type: coursesConstants.GETCOURSETASKTREE_REQUEST } }
    function success(tasktree) { return { type: coursesConstants.GETCOURSETASKTREE_SUCCESS, tasktree } }
    function failure(error) { return { type: coursesConstants.GETCOURSETASKTREE_FAILURE, error } }
}
function getXBlockInfo(blockID) {
    return dispatch => {
        dispatch(request());
        coursesService.getXBlockInfo(blockID)
            .then(
                xblockinfo => {
                    dispatch(success(xblockinfo));
                    return xblockinfo
                },
                error => {
                    dispatch(failure(error));
                    if (error.response.status === 401)
                    {
                        dispatch(userActions.logout());
                    }
                    dispatch(alertActions.error(error.response.data.error ? error.response.data.error : error));
                }
            );
    };
    function request() { return { type: coursesConstants.GETCOURSEXBLOCKINFO_REQUEST } }
    function success(xblockinfo) { return { type: coursesConstants.GETCOURSEXBLOCKINFO_SUCCESS, xblockinfo } }
    function failure(error) { return { type: coursesConstants.GETCOURSEXBLOCKINFO_FAILURE, error } }
}
function createAndEditCourse(courseData, courseEditData) {
    return dispatch => {
        dispatch(requestCreate());
        coursesService.createCourse(courseData)
            .then(
                courseResponse => {
                    if(courseResponse===undefined){
                        dispatch(failureCreate(courseResponse));
                    }else{
                        if (courseResponse.hasOwnProperty('CourseErrMsg')) {
                            dispatch(failureCreate(courseResponse));
                            dispatch(alertActions.error(courseResponse.CourseErrMsg ? courseResponse.CourseErrMsg : courseResponse));
                        }else{
                            dispatch(successCreate(courseResponse));
                            dispatch(requestEdit());
                            courseEditData.course_id = courseResponse.course_key
                            coursesService.updateCourseById(courseResponse.course_key, courseEditData)
                                .then(
                                    updateCourseResponse => {
                                        dispatch(successEdit(updateCourseResponse));
                                        return updateCourseResponse
                                    },
                                    error => {
                                        dispatch(failureEdit(error));
                                        if (error.response.status === 401)
                                        {
                                            dispatch(userActions.logout());
                                        }
                                        dispatch(alertActions.error(error.response.data.error ? error.response.data.error : error));
                                    }
                                );
                        }
                    }
                },
                error => {
                    dispatch(failureCreate(error));
                    if (error.response.status === 401)
                    {
                        dispatch(userActions.logout());
                    }
                    dispatch(alertActions.error(error.response.data.error ? error.response.data.error : error));
                }
            );
    };
    function requestCreate() { return { type: coursesConstants.CREATE_COURSE_REQUEST } }
    function successCreate(courseResponse) { return { type: coursesConstants.CREATE_COURSE_SUCCESS, courseResponse } }
    function failureCreate(error) { return { type: coursesConstants.CREATE_COURSE_FAILURE, error } }
    function requestEdit() { return { type: coursesConstants.UPDATE_COURSE_REQUEST } }
    function successEdit(updateCourseResponse) { return { type: coursesConstants.UPDATE_COURSE_SUCCESS, updateCourseResponse } }
    function failureEdit(error) { return { type: coursesConstants.UPDATE_COURSE_FAILURE, error } }
}
function createCourse(courseData) {
    return dispatch => {
        dispatch(request());
        coursesService.createCourse(courseData)
            .then(
                courseResponse => {
                    if(courseResponse===undefined){
                        dispatch(failure(courseResponse));
                    }else{
                        if (courseResponse.hasOwnProperty('CourseErrMsg')) {
                            dispatch(failure(courseResponse));
                            dispatch(alertActions.error(courseResponse.CourseErrMsg ? courseResponse.CourseErrMsg : courseResponse));
                        }else{
                            dispatch(success(courseResponse));
                            return courseResponse
                        }
                    }
                },
                error => {
                    dispatch(failure(error));
                    if (error.response.status === 401)
                    {
                        dispatch(userActions.logout());
                    }
                    dispatch(alertActions.error(error.response.data.error ? error.response.data.error : error));
                }
            );
    };
    function request() { return { type: coursesConstants.CREATE_COURSE_REQUEST } }
    function success(courseResponse) { return { type: coursesConstants.CREATE_COURSE_SUCCESS, courseResponse } }
    function failure(error) { return { type: coursesConstants.CREATE_COURSE_FAILURE, error } }
}
function clearCreateCourse() {
    return dispatch => {
        dispatch(request());
    };
    //TODO: kanske ska sättas till initial state för status istället
    function request() { return { type: coursesConstants.CREATE_COURSE_INITIAL} }
}
function getCourseById(courseId) {
    return dispatch => {
        dispatch(request());
        coursesService.getCourseById(courseId)
            .then(
                courses => {
                    dispatch(success(courses));
                    return courses
                },
                error => {
                    dispatch(failure(error));
                    if (error.response.status === 401)
                    {
                        dispatch(userActions.logout());
                    }
                    dispatch(alertActions.error(error.response.data.error ? error.response.data.error : error));
                }
            );
    };
    function request() { return { type: coursesConstants.GETCOURSES_REQUEST } }
    function success(courses) { return { type: coursesConstants.GETCOURSES_SUCCESS, courses } }
    function failure(error) { return { type: coursesConstants.GETCOURSES_FAILURE, error } }
}
function updateCourseById(courseId, courseData) {
    return dispatch => {
        dispatch(request());
        coursesService.updateCourseById(courseId,courseData)
            .then(
                updateCourseResponse => {
                    dispatch(success(updateCourseResponse));
                    return updateCourseResponse
                },
                error => {
                    dispatch(failure(error));
                    if (error.response.status === 401)
                    {
                        dispatch(userActions.logout());
                    }
                    dispatch(alertActions.error(error.response.data.error ? error.response.data.error : error));
                }
            );
    };
    function request() { return { type: coursesConstants.UPDATE_COURSE_REQUEST } }
    function success(updateCourseResponse) { return { type: coursesConstants.UPDATE_COURSE_SUCCESS, updateCourseResponse } }
    function failure(error) { return { type: coursesConstants.UPDATE_COURSE_FAILURE, error } }
}
function clearUpdateCourse() {
    // TODO: Add clear
    return dispatch => {
        dispatch(request());
    };
    function request() { return { type: coursesConstants.UPDATE_COURSE_INITIAL } }
}