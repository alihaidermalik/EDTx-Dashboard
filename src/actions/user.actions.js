import { userConstants } from '../constants';
import { userService } from '../services';
import { alertActions } from './';
import { history } from '../helpers';
export const userActions = {
    login,
    logout,
    getUsername,
};
function login(username, password) {
    return dispatch => {
        dispatch(request({ username }));
        userService.login(username, password)
            .then(
                user => {
                    userService.getUsername()
                        .then(username => {
                                dispatch(success(user, username));
                                history.push('/');
                            }
                        )
                },
                error => {
                    dispatch(failure(error));
                    if(error.response !==undefined){
                        dispatch(alertActions.error(error.response.data.message));
                    }else{
                        dispatch(alertActions.error("Internal error. No response from server."));
                    }
                }
            );
    };
    function request(user) { return { type: userConstants.LOGIN_REQUEST, user } }
    function success(user, username) { return { type: userConstants.LOGIN_SUCCESS, user, username } }
    function failure(error) { return { type: userConstants.LOGIN_FAILURE, error } }
}
function logout() {
    userService.logout();
    history.push('/login');
    return { type: userConstants.LOGOUT };
}
function getUsername() {
    return dispatch => {
        dispatch(request());
        userService.getUsername()
            .then(
                users => dispatch(success(users)),
                error => {
                    dispatch(failure(error));
                    dispatch(userActions.logout())
                }
            );
    };
    function request() { return { type: userConstants.GETUSERNAME_REQUEST } }
    function success(users) { return { type: userConstants.GETUSERNAME_SUCCESS, users } }
    function failure(error) { return { type: userConstants.GETUSERNAME_FAILURE, error } }
}
