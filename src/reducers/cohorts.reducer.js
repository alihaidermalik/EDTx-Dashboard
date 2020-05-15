import { cohortsConstants } from '../constants/cohortsConstants';

export function cohorts(state = {cohorts:  []}, action) {
    switch (action.type) {
        case cohortsConstants.GETCOHORTS_REQUEST:
            return {
                fetching: true,
                cohorts: []
            };
        case cohortsConstants.GETCOHORTS_SUCCESS:
            return {
                fetching: true,
                cohorts: action.cohorts,
            };
        case cohortsConstants.GETCOHORTS_FAILURE:
            return {
                fetching: false,
                cohorts: []
            };
        default:
            return state
    }
}
