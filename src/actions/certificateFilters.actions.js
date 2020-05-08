import { certificateFiltersConstants } from '../constants/certificateFilters.constants';
export const certificateFilterActions = {
    setFilters,
    setFiltersValues,
};
function setFilters(pageName) {
    return dispatch => {
        dispatch(setValues(pageName));
    };
    function setValues(pageName) { return { type: certificateFiltersConstants.SET_FILTERS_VALUES, pageName } }
}
function setFiltersValues(filterationObj, pageName) {
    return dispatch => {
        dispatch(setValues(filterationObj, pageName));
    };
    function setValues(filterationObj, pageName) { return { type: certificateFiltersConstants.SET_FILTERS_DROPDOWNS, filterationObj, pageName } }
}