import { FETCH_SENT_ACTIVITIES } from "../actions/types";

export default function(state = [], action) {
  // console.log(action);
  switch (action.type) {
    case FETCH_SENT_ACTIVITIES:
      return action.payload || false;
    default:
      return state;
  }
}
