import axios from "axios";
import {
  GET_ALL_CONTACTS,
  GET_THREADS,
  GET_THREAD_MESSAGES,
  RESET_THREAD_MESSAGE
} from "./types";
import { tokenConfig } from "./auth";
import { createMessage } from "./alerts";

export const getAllContacts = () => (dispatch, getState) => {
  axios
    .get(`/chat/api/contacts/`, tokenConfig(getState))
    .then(res => {
      dispatch({
        type: GET_ALL_CONTACTS,
        payload: res.data
      });
    })
    .catch(err => {
      if (!err.response) {
        dispatch(
          createMessage("Network Error. Something went wrong!", "error")
        );
      } else {
        dispatch(createMessage(`${err.response.status} ${err.response.statusText}`, "error"));
      }
    });
};

export const getAllThreads = () => (dispatch, getState) => {
  axios
    .get(`/chat/api/threads/`, tokenConfig(getState))
    .then(res => {
      dispatch({
        type: GET_THREADS,
        payload: res.data
      });
    })
    .catch(err => {
      if (!err.response) {
        dispatch(
          createMessage("Network Error. Something went wrong!", "error")
        );
      } else {
        dispatch(createMessage(`${err.response.status} ${err.response.statusText}`, "error"));
      }
    });
};

export const getThreadMessages = other_user => (dispatch, getState) => {
  axios
    .get(
      `/chat/api/thread/messages/?other_user=${other_user}`,
      tokenConfig(getState)
    )
    .then(res => {
      dispatch({
        type: GET_THREAD_MESSAGES,
        payload: res.data
      });
    })
    .catch(err => {
      if (!err.response) {
        dispatch(
          createMessage("Network Error. Something went wrong!", "error")
        );
      } else {
        dispatch(createMessage(`${err.response.status} ${err.response.statusText}`, "error"));
      }
    });
};

export const resetMessages = () => {
  dispatch({
    type: RESET_THREAD_MESSAGE
  });
};
