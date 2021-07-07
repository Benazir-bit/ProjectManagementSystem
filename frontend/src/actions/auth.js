import axios from "axios";
import {
  USER_LOADING,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT_SUCCESS,
  SPLASH_LOAD,
  PAGE_LOADED,
  PASSWORD_VALIDATION
} from "./types";
import { createMessage } from "./alerts";
// Login
export const login = (username, password) => dispatch => {
  //HEADERS
  const config = {
    headers: {
      "Content-Type": "application/json"
    }
  };
  dispatch({
    type: SPLASH_LOAD
  });

  //REQUEST BODY
  const body = JSON.stringify({ username, password });
  axios
    .post("/uspl/api/auth/login", body, config)
    .then(res => {
      dispatch({
        type: PAGE_LOADED
      });
      dispatch({
        type: LOGIN_SUCCESS,
        payload: res.data
      });
      dispatch(createMessage("Login Success", "success"));
    })
    .catch(err => {
      if (!err.response) {
        dispatch(
          createMessage("Network Error. Something went wrong!", "error")
        );
        dispatch({
          type: PAGE_LOADED
        });
      } else {
        dispatch(createMessage("Invalid ID/ Password Entered...", "error"));
        dispatch({
          type: LOGIN_FAIL
        });
        dispatch({
          type: PAGE_LOADED
        });
      }
    });
};

export const logout = () => (dispatch, getState) => {
  axios
    .post("/uspl/api/auth/logout", null, tokenConfig(getState))
    .then(res => {
      dispatch({
        type: LOGOUT_SUCCESS
      });
    })
    .catch(err => {
      if (!err.response) {
        dispatch(
          createMessage("Network Error. Something went wrong!", "error")
        );
      } else {
        dispatch(
          createMessage(
            `${err.response.status} ${err.response.statusText}`,
            "error"
          )
        );
      }
    });
};

// CHECK TOKEN & LOAD USER
export const loadUser = () => (dispatch, getState) => {
  // USER LOADING
  dispatch({ type: USER_LOADING });
  axios
    .get("/uspl/api/auth/user", tokenConfig(getState))
    .then(res => {
      setTimeout(() => {
        dispatch({
          type: USER_LOADED,
          payload: res.data
        });
      }, 1250);
    })
    .catch(err => {
      if (!err.response) {
        dispatch(
          createMessage("Network Error. Something went wrong!", "error")
        );
      } else {
        dispatch({
          type: AUTH_ERROR
        });
      }
    });
};

// Password Confrmation

export const confirmPassword = password => (dispatch, getState) => {
  const body = JSON.stringify({ password });
  axios
    .post(`/uspl/api/auth/password/`, body, tokenConfig(getState))
    .then(res => {
      console.log("response", res.data);
      dispatch({
        type: PASSWORD_VALIDATION,
        payload: true
      });
      dispatch(createMessage(res.data.message, "success", "top right"));
    })
    .catch(err => {
      if (!err.response) {
        dispatch(
          createMessage("Network Error. Something went wrong!", "error")
        );
      } else {
        dispatch(createMessage(err.response.data.message, "error"));
      }
    });
};

// SETUP CONFIG WITH TOKEN - HELPER FUNCTION
export const tokenConfig = getState => {
  //GET TOKEN FROM STATE
  const token = getState().auth.token;

  //HEADERS
  const config = {
    headers: {
      "Content-Type": "application/json"
    }
  };

  // IF TOKEN AVAILABLE, ADD TO HEADER (AUTHORIZATION)
  if (token) {
    config.headers["Authorization"] = `Token ${token}`;
  }

  return config;
};
