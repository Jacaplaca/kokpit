import { FETCH_MODULES } from "../actions/types";

export default function(state = [], action) {
  // console.log(action);
  switch (action.type) {
    case FETCH_MODULES:
      return action.payload || false;
    default:
      return state;
  }
}
