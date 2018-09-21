import { combineReducers } from "redux";
import authReducer from "./authReducer";
import formReducer from "./formReducer";
import clickedReducer from "./clickedReducer";
import loadingReducer from "./loadingReducer";

export default combineReducers({
  auth: authReducer,
  formTemp: formReducer,
  clicked: clickedReducer,
  loading: loadingReducer
});
