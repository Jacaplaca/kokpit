import { CLICKED } from "../actions/types";

//export default function(state = false, action) {
export default function(state = "planer", action) {
  //export default function(state = "planerRaporty", action) {
  // console.log(action);
  switch (action.type) {
    case CLICKED:
      return action.payload || false;
    default:
      return state;
  }
}
