import { LANGUAGE } from "../actions/types";

export default function(state = "pl", action) {
  switch (action.type) {
    case LANGUAGE:
      localStorage.setItem("language", action.payload);
      return action.payload;

    default:
      return state;
  }
}
