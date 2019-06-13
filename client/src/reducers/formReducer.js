import { FETCH_FORM } from "../actions/types";

export default function(state = [], action) {
  switch (action.type) {
    case FETCH_FORM:
      return action.payload || false;
    default:
      return state;
  }
}
