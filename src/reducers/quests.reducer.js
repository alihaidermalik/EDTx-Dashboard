import {questsConstants} from '../constants';

export function createQuest(state = {questsResponse: {} , status: "initial"}, action) {
    switch (action.type) {
        case questsConstants.CREATE_QUESTS_INITIAL:
            return {                
                status: "initial",
                questsResponse: {} 
            };
        case questsConstants.CREATE_QUESTS_REQUEST:
            return {                
                status: "request",
                questsResponse: {} 
            };
        case questsConstants.CREATE_QUESTS_SUCCESS:
            return {                
                status: "success",   
                questsResponse: action.questsResponse,             
            };
        case questsConstants.CREATE_QUESTS_FAILURE:
            return {
                status: "failure",
                questsResponse: {} 
            };
        default:
            return state
    }
}

export function updateQuest(state = {updateQuestResponse: {} , status: "initial"}, action) {
    switch (action.type) {
        case questsConstants.UPDATE_QUESTS_REQUEST:
            return {                
                status: "request",
                updateQuestResponse: {} 
            };
        case questsConstants.UPDATE_QUESTS_SUCCESS:
            return {                
                status: "success",   
                updateQuestResponse: action.updateQuestResponse,             
            };
        case questsConstants.UPDATE_QUESTS_FAILURE:
            return {
                status: "failure",
                updateQuestResponse: {} 
            };
        default:
            return state
    }
}

export function quests(state = {quests:  []}, action) {
    switch (action.type) {
        case questsConstants.GETQUESTS_REQUEST:
            return {
                fetching: true,
                quests: []
            };
        case questsConstants.GETQUESTS_SUCCESS:
            return {
                fetching: false,
                quests: action.quests,
            };
        case questsConstants.GETQUESTS_FAILURE:
            return {
                fetching: false,
                quests: []
            };
        default:
            return state
    }
}
export function questDetails(state = {quest:  {}}, action) {
    switch (action.type) {
        case questsConstants.GETQUESTSDETAILS_REQUEST:
            return {
                fetching: true,
                quest: {}
            };
        case questsConstants.GETQUESTSDETAILS_SUCCESS:
            return {
                fetching: false,
                quest: action.quest,
            };
        case questsConstants.GETQUESTSDETAILS_FAILURE:
            return {
                fetching: false,
                quest: {}
            };
        default:
            return state
    }
}

export function deleteQuest(state = {deleteQuestResponse: {}, status: "initial"}, action) {
    switch (action.type) {
        case questsConstants.DELETEQUESTS_REQUEST:
            return {
                status: "request",
                deleteQuestResponse: {} 
            };
        case questsConstants.DELETEQUESTS_SUCCESS:
            return {
                status: "success", 
                deleteQuestResponse: action.deleteQuestResponse,
            };
        case questsConstants.DELETEQUESTS_FAILURE:
            return {
                status: "failure",
                deleteQuestResponse: {}
            };
        default:
            return state
    }
}