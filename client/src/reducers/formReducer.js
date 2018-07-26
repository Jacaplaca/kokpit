import { FETCH_FORM } from '../actions/types';

export default function(state = false, action) {
  // console.log('formReducers');
  // console.log(action);
  switch (action.type) {
    case FETCH_FORM:
      // console.log('fetchform');
      return action.payload || false;
    default:
      // console.log('return default');
      return state;
  }
}
