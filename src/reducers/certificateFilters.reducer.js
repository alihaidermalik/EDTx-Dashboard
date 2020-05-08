import { certificateFiltersConstants } from '../constants/certificateFilters.constants';

let initialState = {
    pageName: 'users',
    filterationObj: {}
};

export function filteration(state = initialState, action) {
  switch (action.type) {
    case certificateFiltersConstants.SET_FILTERS_VALUES:
      initialState.pageName = action.pageName;
      return {
          pageName: initialState.pageName,
      };
    case certificateFiltersConstants.SET_FILTERS_DROPDOWNS:
      console.log(action);
      initialState.filterationObj = action.filterationObj;
      initialState.pageName = action.pageName;
      return {
          filterationObj: initialState.filterationObj,
          pageName: initialState.pageName,
      };
    default:
      return state;
  }
}