import axios from "axios";
import {
  FETCH_USER,
  FETCH_FORM,
  CLICKED,
  LOADING,
  SUBMIT,
  FETCH_MODULES,
  FETCH_CUSTOMERSWITHDETAILS
} from "./types";

export const fetchUser = () => async dispatch => {
  const res = await axios.get("/api/current_user");
  // console.log("fetchUser()", JSON.stringify(res.data));
  dispatch({ type: FETCH_USER, payload: res.data });
};
export const fetchModules = () => async dispatch => {
  const res = await axios.get("/api/allmodules");
  // console.log("fetchUser()", JSON.stringify(res.data));
  dispatch({ type: FETCH_MODULES, payload: res.data });
};
export const fetchCustomersWithDetails = () => async dispatch => {
  const res = await axios.get("/api/customerswithdetails/");
  // console.log("fetchUser()", JSON.stringify(res.data));
  dispatch({ type: FETCH_CUSTOMERSWITHDETAILS, payload: res.data });
};

export const clicked = where => async dispatch => {
  // const res = await axios.get('/api/current_user');
  dispatch({ type: CLICKED, payload: where });
};

export const loading = status => async dispatch => {
  // const res = await axios.get('/api/current_user');
  dispatch({ type: LOADING, payload: status });
};

export const submit = status => async dispatch => {
  // const res = await axios.get('/api/current_user');
  dispatch({ type: SUBMIT, payload: status });
};

export const handleToken = token => async dispatch => {
  const res = await axios.post("/api/stripe", token);
  dispatch({ type: FETCH_USER, payload: res.data });
};

export const fetchForm = () => async dispatch => {
  console.log("fetchForm()");
  const res = await axios.get("/api/message");
  dispatch({ type: FETCH_FORM, payload: res.data });
};
