import { FETCH_CUSTOMERSWITHDETAILS } from "../actions/types";

export default function(state = [], action) {
  // console.log(action);
  switch (action.type) {
    case FETCH_CUSTOMERSWITHDETAILS:
      return action.payload || false;
    default:
      return state;
  }
}
