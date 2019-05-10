import { combineReducers } from "redux";
import authReducer from "./authReducer";
import modulesReducer from "./modulesReducer";
import formReducer from "./formReducer";
import clickedReducer from "./clickedReducer";
import loadingReducer from "./loadingReducer";
import submitReducer from "./submitReducer";
import customerDetailsReducer from "./customerDetailsReducer";

export default combineReducers({
  auth: authReducer,
  modules: modulesReducer,
  customersWithDetails: customerDetailsReducer,
  formTemp: formReducer,
  clicked: clickedReducer,
  loading: loadingReducer,
  submit: submitReducer
});
