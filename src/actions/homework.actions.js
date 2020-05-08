import { homeworkConstants } from '../constants';
import { homeworkService } from '../services';
import { alertActions, userActions } from './';


export const homeworkActions = {
    getHomeworkByBlockId,
    getHomeworkByStudentId,
    setHomeworkOnBlockByStudentId,
    getHomeworkFiles,
    getHomeworkOnBlockByStudentId
};


function getHomeworkByBlockId(activityId, blockId) {
    return dispatch => {
        dispatch(request());

        homeworkService.getHomeworkByBlockId(activityId, blockId)
            .then(
                homework => {
                    dispatch(success(homework));
                    return homework
                },
                error => {
                    dispatch(failure(error));
                    if(error.response !== undefined){

                        if (error.response.status === 401)
                        {
                            dispatch(userActions.logout());
                        }
                        dispatch(alertActions.error(error.response.data.error ? error.response.data.error : error));
                    } else {
                        dispatch(alertActions.error("Internal server error, no response from server."));
                    }
                }
            );
    };

    function request() { return { type: homeworkConstants.GET_HOMEWORK_REQUEST } }
    function success(homework) { return { type: homeworkConstants.GET_HOMEWORK_SUCCESS, homework } }
    function failure(error) { return { type: homeworkConstants.GET_HOMEWORK_FAILURE, error } }
}

function getHomeworkByStudentId(activityId, studentId) {
    return dispatch => {
        dispatch(request());

        homeworkService.getHomeworkByStudentId(activityId, studentId)
            .then(
                homework => {
                    dispatch(success(homework, studentId));
                    return homework
                },
                error => {
                    dispatch(failure(error));
                    if(error.response !== undefined){

                        if (error.response.status === 401)
                        {
                            dispatch(userActions.logout());
                        }
                        dispatch(alertActions.error(error.response.data.error ? error.response.data.error : error));
                    } else {
                        dispatch(alertActions.error("Internal server error, no response from server."));
                    }
                }
            );
    };

    function request() { return { type: homeworkConstants.GET_HOMEWORK_REQUEST } }
    function success(homework, studentId) { return { type: homeworkConstants.GET_HOMEWORK_SUCCESS, homework , studentId} }
    function failure(error) { return { type: homeworkConstants.GET_HOMEWORK_FAILURE, error } }
}


function getHomeworkOnBlockByStudentId(activityId,blockId, studentId) {
    //TODO: skriv egna constants / reducer
    return dispatch => {
        dispatch(request());

        homeworkService.getHomeworkOnBlockByStudentId(activityId, blockId, studentId)
            .then(
                homework => {
                    dispatch(success(homework, blockId, studentId));
                    return homework
                },
                error => {
                    dispatch(failure(error));
                    if(error.response !== undefined){

                        if (error.response.status === 401)
                        {
                            dispatch(userActions.logout());
                        }
                        dispatch(alertActions.error(error.response.data.error ? error.response.data.error : error));
                    } else {
                        dispatch(alertActions.error("Internal server error, no response from server."));
                    }
                }
            );
    };

    function request() { return { type: homeworkConstants.GET_HOMEWORK_BY_ID_REQUEST } }
    function success(homework, blockId, studentId) { return { type: homeworkConstants.GET_HOMEWORK_BY_ID_SUCCESS, homework , blockId, studentId} }
    function failure(error) { return { type: homeworkConstants.GET_HOMEWORK_BY_ID_FAILURE, error } }
}

function setHomeworkOnBlockByStudentId(activityId, blockId,  studentId, gradeData) {
    return dispatch => {
        dispatch(request());

        homeworkService.setHomeworkOnBlockByStudentId(activityId, blockId,  studentId, gradeData)
            .then(
                setHomeworkResponse => {
                    dispatch(success(setHomeworkResponse));
                    return setHomeworkResponse
                },
                error => {
                    dispatch(failure(error));
                    if(error.response !== undefined){

                        if (error.response.status === 401)
                        {
                            dispatch(userActions.logout());
                        }
                        
                    } else {
                        dispatch(alertActions.error("Internal server error, no response from server."));
                    }
                }
            );
    };

    function request() { return { type: homeworkConstants.SET_HOMEWORK_REQUEST } }
    function success(setHomeworkResponse) { return { type: homeworkConstants.SET_HOMEWORK_SUCCESS, setHomeworkResponse } }
    function failure(error) { return { type: homeworkConstants.SET_HOMEWORK_FAILURE, error } }
}



function getHomeworkFiles(activityId, studentId) {
    return dispatch => {
        dispatch(request());

        homeworkService.getHomeworkFiles(activityId, studentId)
            .then(
                homeworkFiles => {
                    dispatch(success(homeworkFiles, studentId));
                    return homeworkFiles
                },
                error => {
                    dispatch(failure(error));
                    if(error.response !== undefined){

                        if (error.response.status === 401)
                        {
                            dispatch(userActions.logout());
                        }
                        dispatch(alertActions.error(error.response.data.error ? error.response.data.error : error));
                    } else {
                        dispatch(alertActions.error("Internal server error, no response from server."));
                    }
                }
            );
    };

    function request() { return { type: homeworkConstants.GET_HOMEWORK_FILES_REQUEST } }
    function success(homeworkFiles, studentId) { return { type: homeworkConstants.GET_HOMEWORK_FILES_SUCCESS, homeworkFiles, studentId } }
    function failure(error) { return { type: homeworkConstants.GET_HOMEWORK_FILES_FAILURE, error } }
}