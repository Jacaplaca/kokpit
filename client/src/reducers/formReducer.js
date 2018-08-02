import { FETCH_FORM } from '../actions/types';

export default function(state = false, action) {
  switch (action.type) {
    case FETCH_FORM:
      return action.payload || false;
    default:
      return state;
  }
}
