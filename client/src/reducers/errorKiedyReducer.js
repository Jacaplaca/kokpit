import { ERRORKIEDY } from "../actions/types";

export default function(state = false, action) {
  //console.log(action);
  //export default function(state = "planer", action) {
  //export default function(state = "planerRaporty", action) {
  // console.log(action);
  switch (action.type) {
    case ERRORKIEDY:
      return action.payload || false;
    default:
      return state;
  }
}
