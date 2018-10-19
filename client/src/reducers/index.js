import { combineReducers } from "redux";
import authReducer from "./authReducer";
import formReducer from "./formReducer";
import clickedReducer from "./clickedReducer";
import loadingReducer from "./loadingReducer";
import submitReducer from "./submitReducer";
import errorStopReducer from "./errorStopReducer";
import errorStartReducer from "./errorStartReducer";
import errorKiedyReducer from "./errorKiedyReducer";

export default combineReducers({
  auth: authReducer,
  formTemp: formReducer,
  clicked: clickedReducer,
  loading: loadingReducer,
  submit: submitReducer,
  errorStopAction: errorStopReducer,
  errorStartAction: errorStartReducer,
  errorKiedyAction: errorKiedyReducer
});
