import { LOADING_SENT_ACITIVITIES } from "../actions/types";

export default function(state = false, action) {
  // console.log(action);
  switch (action.type) {
    case LOADING_SENT_ACITIVITIES:
      return action.payload || false;
    default:
      return state;
  }
}
