import {messageConstants} from '../constants';
export function messages(state = {messages:  {}, fetching: true}, action) {
    switch (action.type) {
        case messageConstants.GET_MESSAGES_REQUEST:
            return {
                fetching: true,
                messages: {}
            };
        case messageConstants.GET_MESSAGES_SUCCESS:
            return {
                fetching: false,
                messages: action.messages,
            };
        case messageConstants.GET_MESSAGES_FAILURE:
            return {
                fetching: false,
                messages: {}
            };
        default:
            return state
    }
}
export function postMessage(state = {messageResponse: {} , status: "initial"}, action) {
    switch (action.type) {
        case messageConstants.CREATE_MESSAGE_INITIAL:
            return {                
                status: "initial",
                messageResponse: {} 
            };
        case messageConstants.CREATE_MESSAGE_REQUEST:
            return {                
                status: "request",
                messageResponse: {} 
            };
        case messageConstants.CREATE_MESSAGE_SUCCESS:
            return {
                status: "success",
                messageResponse: action.messageResponse,
            };
        case messageConstants.CREATE_MESSAGE_FAILURE:
            return {
                status: "failure",
                messageResponse: {} 
            };
        default:
            return state
    }
}
export function messageCount(state = {messageCount:  {}, fetching: true}, action) {
    switch (action.type) {
        case messageConstants.GET_MESSAGE_COUNT_REQUEST:
            return {
                fetching: true,
                messageCount: {}
            };
        case messageConstants.GET_MESSAGE_COUNT_SUCCESS:
            return {
                fetching: false,
                messageCount: action.countData.count,
            };
        case messageConstants.GET_MESSAGE_COUNT_FAILURE:
            return {
                fetching: false,
                messageCount: {}
            };
        default:
            return state
    }
}
export function contacts(state = {contactData: {}, fetching: true}, action) {
    switch (action.type) {
        case messageConstants.GET_CONTACTS_REQUEST:
            return {
                fetching: true,
                contactData: {}
            };
        case messageConstants.GET_CONTACTS_SUCCESS:
            return {
                fetching: false,
                contactData: action.contactData,
            };
        case messageConstants.GET_CONTACTS_FAILURE:
            return {
                fetching: false,
                contactData: {}
            };
        default:
            return state
    }
}