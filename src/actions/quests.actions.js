import { questsConstants } from '../constants';
import { questsService } from '../services';
import { alertActions, userActions } from './';
export const questsActions = {
    createQuest,
    clearCreateQuest,
    updateQuestById,
    clearUpdateQuest,
    getQuestDetails,
    deleteQuest,
    getQuests,
    clearDeleteQuest,
    getQuestsSlim
};
function createQuest(questsData) {
    return dispatch => {
        dispatch(request());
        questsService.createQuest(questsData)
            .then(
                questsResponse => {
                    if (questsResponse === undefined) {
                        dispatch(failure(questsResponse));
                    } else {
                        dispatch(success(questsResponse));
                        return questsResponse;
                    }
                },
                error => {
                    dispatch(failure(error));
                    if (error.response) {
                        if (error.response.status === 401) {
                            dispatch(userActions.logout());
                        }
                    } else {
                        dispatch(alertActions.error("Error trying to create Quest."));
                    }
                }
            );
    };
    function request() { return { type: questsConstants.CREATE_QUESTS_REQUEST } }
    function success(questsResponse) { return { type: questsConstants.CREATE_QUESTS_SUCCESS, questsResponse } }
    function failure(error) { return { type: questsConstants.CREATE_QUESTS_FAILURE, error } }
}
function clearCreateQuest() {
    return dispatch => {
        dispatch(initial());
    };
    function initial() { return { type: questsConstants.CREATE_QUESTS_INITIAL } }
}
function updateQuestById(questId, questsData) {
    return dispatch => {
        dispatch(request());
        questsService.updateQuestById(questId, questsData)
            .then(
                updateQuestResponse => {
                    dispatch(success(updateQuestResponse));
                    return updateQuestResponse
                },
                error => {
                    dispatch(failure(error));
                    if (error.response) {
                        if (error.response.status === 401) {
                            dispatch(userActions.logout());
                        }
                        dispatch(alertActions.error(error.response.data.error ? error.response.data.error : error));
                    } else {
                        dispatch(alertActions.error("Error trying to update Quest."));
                    }
                }
            );
    };
    function request() { return { type: questsConstants.UPDATE_QUESTS_REQUEST } }
    function success(updateQuestResponse) { return { type: questsConstants.UPDATE_QUESTS_SUCCESS, updateQuestResponse } }
    function failure(error) { return { type: questsConstants.UPDATE_QUESTS_FAILURE, error } }
}
function clearUpdateQuest() {
    // TODO: Add clear
    return dispatch => {
        dispatch(request());
    };
    function request() { return { type: questsConstants.UPDATE_QUESTS_REQUEST } }
}
function getQuestDetails(questID) {
    return dispatch => {
        dispatch(request());
        questsService.getQuestDetails(questID)
            .then(
                quest => {
                    dispatch(success(quest));
                    return quest
                },
                error => {
                    dispatch(failure(error));
                    if (error.response !== undefined && error.response.data !== undefined) {
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
    function request() { return { type: questsConstants.GETQUESTSDETAILS_REQUEST } }
    function success(quest) { return { type: questsConstants.GETQUESTSDETAILS_SUCCESS, quest } }
    function failure(error) { return { type: questsConstants.GETQUESTSDETAILS_FAILURE, error } }
}
function getQuests(homework = null, page = false, page_size = false) {
    
    return dispatch => {
        dispatch(request());
        questsService.getQuests(homework, page, page_size)
            .then(
                quests => {
                    dispatch(success(quests));
                    return quests
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
    function request() { return { type: questsConstants.GETQUESTS_REQUEST } }
    function success(quests) { return { type: questsConstants.GETQUESTS_SUCCESS, quests } }
    function failure(error) { return { type: questsConstants.GETQUESTS_FAILURE, error } }
}
function getQuestsSlim(homework = false, page = false, page_size = false) {
    
    return dispatch => {
        dispatch(request());
        questsService.getQuestsSlim(homework, page, page_size)
            .then(
                quests => {
                    dispatch(success(quests));
                    return quests
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
    function request() { return { type: questsConstants.GETQUESTS_REQUEST } }
    function success(quests) { return { type: questsConstants.GETQUESTS_SUCCESS, quests } }
    function failure(error) { return { type: questsConstants.GETQUESTS_FAILURE, error } }
}
function deleteQuest(questsID) {
    return dispatch => {
        dispatch(request());
        questsService.deleteQuest(questsID)
            .then(
                quests => {
                    dispatch(success(quests));
                    return quests
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
    function request() { return { type: questsConstants.DELETEQUESTS_REQUEST } }
    function success(quests) { return { type: questsConstants.DELETEQUESTS_SUCCESS, quests } }
    function failure(error) { return { type: questsConstants.DELETEQUESTS_FAILURE, error } }
}
function clearDeleteQuest() {
    // TODO: Add clear
    return dispatch => {
        dispatch(request());
    };
    function request() { return { type: questsConstants.DELETEQUESTS_REQUEST } }
}