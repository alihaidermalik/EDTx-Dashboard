import { sectionConstants } from '../constants';
import { sectionService } from '../services';
import { alertActions, userActions } from './';


export const sectionActions = {
    createSection,
    clearCreateSection,
    updateSectionById,
    clearUpdateSection,
    getSectionDetails,
    deleteSection
};

function createSection(sectionData) {
    return dispatch => {
        dispatch(request());

        sectionService.createSection(sectionData)
            .then(
                sectionResponse => {
                    
                    if(sectionResponse===undefined){
                        dispatch(failure(sectionResponse));
                    }else{      
                        dispatch(success(sectionResponse));
                        var sectionData = {
                            section_id : sectionResponse.locator,                           
                            publish: "make_public"           
                        }
                        
                        dispatch(sectionActions.updateSectionById(sectionResponse.locator,sectionData));
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

    function request() { return { type: sectionConstants.CREATE_SECTION_REQUEST } }
    function success(sectionResponse) { return { type: sectionConstants.CREATE_SECTION_SUCCESS, sectionResponse } }
    function failure(error) { return { type: sectionConstants.CREATE_SECTION_FAILURE, error } }
}
function clearCreateSection() {
    // TODO: Add clear
    return dispatch => {
        dispatch(request());        
    };

    function request() { return { type: sectionConstants.CREATE_SECTION_REQUEST } }
}

function updateSectionById(sectionId, sectionData) {
    
    
    
    return dispatch => {
        dispatch(request());

        sectionService.updateSectionById(sectionId,sectionData)
            .then(
                updateSectionResponse => {
                    
                    dispatch(success(updateSectionResponse));
                    return updateSectionResponse
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

    function request() { return { type: sectionConstants.UPDATE_SECTION_REQUEST } }
    function success(updateSectionResponse) { return { type: sectionConstants.UPDATE_SECTION_SUCCESS, updateSectionResponse } }
    function failure(error) { return { type: sectionConstants.UPDATE_SECTION_FAILURE, error } }
}
function clearUpdateSection() {
    return dispatch => {
        dispatch(request());        
    };

    function request() { return { type: sectionConstants.UPDATE_SECTION_REQUEST } }
}

function getSectionDetails(sectionID) {
    return dispatch => {
        dispatch(request());

        sectionService.getSectionDetails(sectionID)
            .then(
                section => {
                    dispatch(success(section));
                    return section
                },
                error => {
                    dispatch(failure(error));
                    if(error.response !== undefined){

                        if (error.response.status === 401)
                        {
                            dispatch(userActions.logout());
                        }
                        dispatch(alertActions.error(error.response.data.error ? error.response.data.error : error));
                    }else{
                        dispatch(alertActions.error("Internal server error, no response from server."));
                    }
                }
            );
    };

    function request() { return { type: sectionConstants.GETSECTION_REQUEST } }
    function success(section) { return { type: sectionConstants.GETSECTION_SUCCESS, section } }
    function failure(error) { return { type: sectionConstants.GETSECTION_FAILURE, error } }
}

function deleteSection(sectionID) {
    return dispatch => {
        dispatch(request());

        sectionService.deleteSection(sectionID)
            .then(
                section => {
                    dispatch(success(section));
                    return section
                },
                error => {
                    dispatch(failure(error));
                    if(error.response !==undefined){

                        if (error.response.status === 401)
                        {
                            dispatch(userActions.logout());
                        }
                        dispatch(alertActions.error(error.response.data.error ? error.response.data.error : error));
                    }else{
                        dispatch(alertActions.error("Internal server error, no response from server."));
                    }
                }
            );
    };

    function request() { return { type: sectionConstants.DELETESECTION_REQUEST } }
    function success(section) { return { type: sectionConstants.DELETESECTION_SUCCESS, section } }
    function failure(error) { return { type: sectionConstants.DELETESECTION_FAILURE, error } }
}