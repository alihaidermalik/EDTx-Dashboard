import {homeworkConstants} from '../constants';

export function getHomework(state = {homework: {} , status: "initial"}, action) {
    switch (action.type) {
        case homeworkConstants.GET_HOMEWORK_REQUEST:
            return {                
                ...state,
                status: "request"
            };
        case homeworkConstants.GET_HOMEWORK_SUCCESS:
            return {                   
                homework: {
                    ...state.homework,
                    [action.studentId]: action.homework
                },
                status: "success",
            };
        case homeworkConstants.GET_HOMEWORK_FAILURE:
            return {
                ...state,
                status: "failure"
            };
        default:
            return state
    }
}
export function getHomeworkOnBlockById(state = {homework: {} , status: "initial"}, action) {
    switch (action.type) {
        case homeworkConstants.GET_HOMEWORK_BY_ID_REQUEST:
            return {                
                ...state,
                status: "request"
            };
        case homeworkConstants.GET_HOMEWORK_BY_ID_SUCCESS:
            return {                   
                homework: {
                    ...state.homework,
                    [action.studentId]: {
                        tasks: {
                            [action.blockId]: action.homework
                        }
                    }
                },
                status: "success",
            };
        case homeworkConstants.GET_HOMEWORK_BY_ID_FAILURE:
            return {
                ...state,
                status: "failure"
            };
        default:
            return state
    }
}

export function setHomework(state = {setHomeworkResponse: {} , status: "initial"}, action) {
    switch (action.type) {
        case homeworkConstants.SET_HOMEWORK_REQUEST:
            return {                
                status: "request",
                setHomeworkResponse: {} 
            };
        case homeworkConstants.SET_HOMEWORK_SUCCESS:
            return {                
                status: "success",   
                setHomeworkResponse: action.setHomeworkResponse,             
            };
        case homeworkConstants.SET_HOMEWORK_FAILURE:
            return {
                status: "failure",
                setHomeworkResponse: {} 
            };
        default:
            return state
    }
}

export function getHomeworkFiles(state = {homeworkFiles: {} , status: "initial"}, action) {
    switch (action.type) {
        case homeworkConstants.GET_HOMEWORK_FILES_REQUEST:
            return {  
                ...state,              
                status: "request",
            };
        case homeworkConstants.GET_HOMEWORK_FILES_SUCCESS:
            return {                
                status: "success",   
                homeworkFiles: {
                    ...state.homeworkFiles,
                    [action.studentId]: action.homeworkFiles
                },           
            };
        case homeworkConstants.GET_HOMEWORK_FILES_FAILURE:
            return {
                ...state,
                status: "failure",
            };
        default:
            return state
    }
}
