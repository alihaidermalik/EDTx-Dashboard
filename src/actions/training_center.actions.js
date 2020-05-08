import { trainingCenterConstants } from '../constants';
import { trainingCentersService } from '../services';
import { alertActions, userActions } from './';


export const trainingCenterActions = {
    getTrainingCenters
};

function getTrainingCenters() {
    return dispatch => {
        dispatch(request());

        trainingCentersService.getTrainingCenters()
            .then(
                trainingCenters => {
                    dispatch(success(trainingCenters));
                    return trainingCenters
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

    function request() { return { type: trainingCenterConstants.GET_TRAINING_CENTER_REQUEST } }
    function success(trainingCenters) { return { type: trainingCenterConstants.GET_TRAINING_CENTER_SUCCESS, trainingCenters } }
    function failure(error) { return { type: trainingCenterConstants.GET_TRAINING_CENTER_FAILURE, error } }
}
