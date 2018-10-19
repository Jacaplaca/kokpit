import axios from "axios";
import {
  FETCH_USER,
  FETCH_FORM,
  CLICKED,
  LOADING,
  SUBMIT,
  ERRORSTOP,
  ERRORSTART,
  ERRORKIEDY
} from "./types";

export const fetchUser = () => async dispatch => {
  const res = await axios.get("/api/current_user");
  dispatch({ type: FETCH_USER, payload: res.data });
};

export const clicked = where => async dispatch => {
  dispatch({ type: CLICKED, payload: where });
};

export const errorStopAction = error => async dispatch => {
  dispatch({ type: ERRORSTOP, payload: error });
};

export const errorStartAction = error => async dispatch => {
  dispatch({ type: ERRORSTART, payload: error });
};

export const errorKiedyAction = error => async dispatch => {
  dispatch({ type: ERRORKIEDY, payload: error });
};

export const loading = status => async dispatch => {
  dispatch({ type: LOADING, payload: status });
};

export const submit = status => async dispatch => {
  dispatch({ type: SUBMIT, payload: status });
};

export const handleToken = token => async dispatch => {
  const res = await axios.post("/api/stripe", token);
  dispatch({ type: FETCH_USER, payload: res.data });
};

export const fetchForm = () => async dispatch => {
  const res = await axios.get("/api/message");
  dispatch({ type: FETCH_FORM, payload: res.data });
};
