import {coursesConstants} from '../constants';

export function courses(state = {courses:  [], deets: {},}, action) {
    switch (action.type) {
        case coursesConstants.GETCOURSES_REQUEST:
            return {
                fetching: true,
                courses: []
            };
        case coursesConstants.GETCOURSES_SUCCESS:
            return {
                fetching: false,
                courses: action.courses,
            };
        case coursesConstants.GETCOURSES_FAILURE:
            return {
                fetching: false,
                courses: []
            };
        default:
            return state
    }
}

export function deetss(state = { deets: {}, fetchingDetails: true}, action) {
    switch (action.type) {
        case coursesConstants.GETCOURSEDETAILS_REQUEST:
            return {
                fetchingDetails: true,
                deets: {}
            };
        case coursesConstants.GETCOURSEDETAILS_SUCCESS:
            return {
                fetchingDetails: false,
                deets: action.deets
            };
        case coursesConstants.GETCOURSEDETAILS_FAILURE:
            return {
                fetchingDetails: false,
                deets: {}
            };
        default:
            return state
    }
}
//TODO: fetchingTasktree initial state was true
export function tasktrees(state = {fetchingTasktree: true, tasktree: {}}, action) {
    switch (action.type) {
        case coursesConstants.GETCOURSETASKTREE_REQUEST:
            return {
                fetchingTasktree: true,
                tasktree: {}
            };
        case coursesConstants.GETCOURSETASKTREE_SUCCESS:
            return {
                fetchingTasktree: false,
                tasktree: action.tasktree
            };
        case coursesConstants.GETCOURSETASKTREE_FAILURE:
            return {
                fetchingTasktree: false,
                tasktree: {}
            };
        default:
            return state
    }
}

export function xblockinfos(state = {fetchingXBlockInfo: true, xblockinfo: {}}, action) {
    switch (action.type) {
        case coursesConstants.GETCOURSEXBLOCKINFO_REQUEST:
            return {
                fetchingXBlockInfo: true,
                xblockinfo: {}
            };
        case coursesConstants.GETCOURSEXBLOCKINFO_SUCCESS:
            return {
                fetchingXBlockInfo: false,
                xblockinfo: action.xblockinfo
            };
        case coursesConstants.GETCOURSEXBLOCKINFO_FAILURE:
            return {
                fetchingXBlockInfo: false,
                xblockinfo: {}
            };
        case coursesConstants.GETCOURSEXBLOCKINFO_INITIAL:
            return {
                fetchingXBlockInfo: false,
                xblockinfo: {}
            };
        default:
            return state
    }
}

export function createCourse(state = {courseResponse: {} , status: "initial"}, action) {
    switch (action.type) {
        case coursesConstants.CREATE_COURSE_REQUEST:
            return {                
                status: "request",
                courseResponse: {} 
            };
        case coursesConstants.CREATE_COURSE_SUCCESS:
            return {                
                status: "success",   
                courseResponse: action.courseResponse,             
            };
        case coursesConstants.CREATE_COURSE_FAILURE:
            return {
                status: "failure",
                courseResponse: {} 
            };
        case coursesConstants.CREATE_COURSE_INITIAL:
            return {
                status: "initial",
                courseResponse: {} 
            };
        default:
            return state
    }
}

export function updateCourse(state = {updateCourseResponse: {} , status: "initial"}, action) {
    switch (action.type) {
        case coursesConstants.UPDATE_COURSE_REQUEST:
            return {                
                status: "request",
                updateCourseResponse: {} 
            };
        case coursesConstants.UPDATE_COURSE_SUCCESS:
            return {                
                status: "success",   
                updateCourseResponse: action.updateCourseResponse,             
            };
        case coursesConstants.UPDATE_COURSE_FAILURE:
            return {
                status: "failure",
                updateCourseResponse: {} 
            };
        case coursesConstants.UPDATE_COURSE_INITIAL:
            return {
                status: "initial",
                updateCourseResponse: {} 
            };
        default:
            return state
    }
}