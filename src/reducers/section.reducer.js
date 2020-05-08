import {sectionConstants} from '../constants';

export function createSection(state = {sectionResponse: {} , status: "initial"}, action) {
    switch (action.type) {
        case sectionConstants.CREATE_SECTION_REQUEST:
            return {                
                status: "request",
                sectionResponse: {} 
            };
        case sectionConstants.CREATE_SECTION_SUCCESS:
            return {                
                status: "success",   
                sectionResponse: action.sectionResponse,             
            };
        case sectionConstants.CREATE_SECTION_FAILURE:
            return {
                status: "failure",
                sectionResponse: {} 
            };
        default:
            return state
    }
}

export function updateSection(state = {updateSectionResponse: {} , status: "initial"}, action) {
    switch (action.type) {
        case sectionConstants.UPDATE_SECTION_REQUEST:
            return {                
                status: "request",
                updateSectionResponse: {} 
            };
        case sectionConstants.UPDATE_SECTION_SUCCESS:
            return {                
                status: "success",   
                updateSectionResponse: action.updateSectionResponse,             
            };
        case sectionConstants.UPDATE_SECTION_FAILURE:
            return {
                status: "failure",
                updateSectionResponse: {} 
            };
        default:
            return state
    }
}

export function section(state = {section:  [], sectionFetching: true}, action) {
    switch (action.type) {
        case sectionConstants.GETSECTION_REQUEST:
            return {
                sectionFetching: true,
                section: []
            };
        case sectionConstants.GETSECTION_SUCCESS:
            return {
                sectionFetching: false,
                section: action.section,
            };
        case sectionConstants.GETSECTION_FAILURE:
            return {
                sectionFetching: false,
                section: []
            };
        default:
            return state
    }
}

export function deleteSection(state = {deleteSectionResponse: {}, status: "initial"}, action) {
    switch (action.type) {
        case sectionConstants.DELETESECTION_REQUEST:
            return {
                status: "request",
                deleteSectionResponse: {} 
            };
        case sectionConstants.DELETESECTION_SUCCESS:
            return {
                status: "success", 
                deleteSectionResponse: action.deleteSectionResponse,
            };
        case sectionConstants.DELETESECTION_FAILURE:
            return {
                status: "failure",
                deleteSectionResponse: {}
            };
        default:
            return state
    }
}