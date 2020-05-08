import { messageConstants } from '../constants';
import { messageService } from '../services';
import { alertActions, userActions } from './';

export const messageActions = {
    getMessages,
    postMessage,
    clearPostMessage,
    deleteMessage,
    clearDeleteMessage,
    getMessageCount,
    getContacts,
    postMessageMulti
};
function getMessages(username,page = 1, page_size=10) {
    return dispatch => {
        dispatch(request());
        messageService.getMessages(username, page, page_size)
            .then(
                messages => {
                    dispatch(success(messages));
                    return messages
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
    function request() { return { type: messageConstants.GET_MESSAGES_REQUEST } }
    function success(messages) { return { type: messageConstants.GET_MESSAGES_SUCCESS, messages } }
    function failure(error) { return { type: messageConstants.GET_MESSAGES_FAILURE, error } }
}
function postMessage(messageData) {
    return dispatch => {
        dispatch(request());
        messageService.postMessage(messageData)
            .then(
                messageResponse => {
                    
                    if(messageResponse===undefined){
                        dispatch(failure(messageResponse));
                    }else{      
                        dispatch(success(messageResponse));
                        return messageResponse;                        
                    }
                },
                error => {
                    
                    dispatch(failure(error));
                    if(error.response){
                        if (error.response.status === 401)
                        {
                            dispatch(userActions.logout());
                        }
                        
                    }else{
                        dispatch(alertActions.error("Error trying to create Message."));
                    }
                }
            );
    };
    function request() { return { type: messageConstants.CREATE_MESSAGE_REQUEST } }
    function success(messageResponse) { return { type: messageConstants.CREATE_MESSAGE_SUCCESS, messageResponse } }
    function failure(error) { return { type: messageConstants.CREATE_MESSAGE_FAILURE, error } }
}
function postMessageMulti(messageData) {
    return dispatch => {
        dispatch(request());
        messageService.postMessageMulti(messageData)
            .then(
                messageResponse => {
                    if(messageResponse===undefined){
                        dispatch(failure(messageResponse));
                        dispatch(alertActions.error("Error trying to create Message."));
                        /*setTimeout(() => {
                            dispatch(alertActions.clear());
                        }, 3000);*/
                    }else{      
                        dispatch(success(messageResponse));
                        dispatch(alertActions.success("Your Message Has Been Sent."));
                       /* setTimeout(() => {
                            dispatch(alertActions.clear());
                        }, 3000);*/
                        return messageResponse;
                    }
                },
                error => {
                    
                    dispatch(failure(error));
                    if(error.response){
                        if (error.response.status === 401)
                        {
                            dispatch(userActions.logout());
                        }
                        
                    }else{
                        dispatch(alertActions.error("Error trying to create Message."));
                    }
                }
            );
    };
    function request() { return { type: messageConstants.CREATE_MESSAGE_REQUEST } }
    function success(messageResponse) { return { type: messageConstants.CREATE_MESSAGE_SUCCESS, messageResponse } }
    function failure(error) { return { type: messageConstants.CREATE_MESSAGE_FAILURE, error } }
}
function clearPostMessage() {    
    return dispatch => {
        dispatch(request());        
    };
    function request() { return { type: messageConstants.CREATE_MESSAGE_INITIAL } }
}
function deleteMessage(messageID) {
    return dispatch => {
        dispatch(request());
        messageService.deleteMessage(messageID)
            .then(
                message => {
                    dispatch(success(message));
                    return message
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
    function request() { return { type: messageConstants.DELETEQUESTS_REQUEST } }
    function success(message) { return { type: messageConstants.DELETEQUESTS_SUCCESS, message } }
    function failure(error) { return { type: messageConstants.DELETEQUESTS_FAILURE, error } }
}
function clearDeleteMessage() {
    // TODO: Add clear
    return dispatch => {
        dispatch(request());        
    };
    function request() { return { type: messageConstants.DELETEQUESTS_REQUEST } }
}
function getMessageCount() {
    return dispatch => {
        dispatch(request());
        messageService.getCountMessages()
            .then(
                countData => {
                    dispatch(success(countData));
                    return countData
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
    function request() { return { type: messageConstants.GET_MESSAGE_COUNT_REQUEST } }
    function success(countData) { return { type: messageConstants.GET_MESSAGE_COUNT_SUCCESS, countData } }
    function failure(error) { return { type: messageConstants.GET_MESSAGE_COUNT_FAILURE, error } }
}
function getContacts(page = 1 , page_size = 10) {
    return dispatch => {
        dispatch(request());
        messageService.getContacts(page, page_size)
            .then(
                contactData => {
                    dispatch(success(contactData));
                    return contactData
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
    function request() { return { type: messageConstants.GET_CONTACTS_REQUEST } }
    function success(contactData) { return { type: messageConstants.GET_CONTACTS_SUCCESS, contactData } }
    function failure(error) { return { type: messageConstants.GET_CONTACTS_FAILURE, error } }
}