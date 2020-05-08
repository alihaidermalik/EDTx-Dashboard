import {studentsConstants} from '../constants';

export function students(state = {students:  []}, action) {
    switch (action.type) {
        case studentsConstants.GETSTUDENTS_REQUEST:
            return {
                fetching: true,
                students: []
            };
        case studentsConstants.GETSTUDENTS_SUCCESS:
            return {
                fetching: true,
                students: action.students,
            };
        case studentsConstants.GETSTUDENTS_FAILURE:
            return {
                fetching: false,
                students: []
            };
        default:
            return state
    }
}
