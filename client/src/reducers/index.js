import { combineReducers } from "redux";
import authReducer from "./authReducer";
import modulesReducer from "./modulesReducer";
import formReducer from "./formReducer";
import clickedReducer from "./clickedReducer";
import loadingReducer from "./loadingReducer";
import submitReducer from "./submitReducer";

export default combineReducers({
  auth: authReducer,
  modules: modulesReducer,
  formTemp: formReducer,
  clicked: clickedReducer,
  loading: loadingReducer,
  submit: submitReducer
});
