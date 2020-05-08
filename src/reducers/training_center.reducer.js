import {trainingCenterConstants} from '../constants';

export function trainingCenter(state = {trainingCenters:  [], fetching: true}, action) {
    switch (action.type) {
        case trainingCenterConstants.GET_TRAINING_CENTER_REQUEST:
            return {
                fetching: true,
                trainingCenters: []
            };
        case trainingCenterConstants.GET_TRAINING_CENTER_SUCCESS:
            return {
                fetching: false,
                trainingCenters: action.trainingCenters.results,
            };
        case trainingCenterConstants.GET_TRAINING_CENTER_FAILURE:
            return {
                fetching: false,
                trainingCenters: []
            };
        default:
            return state
    }
}
