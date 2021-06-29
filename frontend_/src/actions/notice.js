import axios from "axios";
import {
  GET_TYPE_NOTICE,
  GET_NOTICE_DETAILS,
  DELETE_MODAL_SUBMIT_DONE
} from "./types";
import { tokenConfig } from "./auth";
import { createMessage } from "./alerts";

export const getTypeNotices = (type, offset, limit) => (dispatch, getState) => {
  dispatch({
    type: GET_TYPE_NOTICE,
    payload: null
  });
  let api_link;
  if ((offset == null) & (limit == null)) {
    api_link = `/uspl/api/notices/${type}/`;
  } else {
    api_link = `/uspl/api/notices/${type}?offset=${0}&limit=${20}`;
  }

  axios
    .get(api_link, tokenConfig(getState))
    .then(res => {
      dispatch({
        type: GET_TYPE_NOTICE,
        payload: res.data
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

export const getNoticeDetails = id => (dispatch, getState) => {
  dispatch({
    type: GET_NOTICE_DETAILS,
    payload: null
  });
  axios
    .get(`/uspl/api/notice/?id=${id}`, tokenConfig(getState))
    .then(res => {
      dispatch({
        type: GET_NOTICE_DETAILS,
        payload: res.data
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

export const addNewNotice = (title, body, expires_on, important) => (
  dispatch,
  getState
) => {
  const reqbody = { title, body, expires_on, important };
  axios
    .post(`/uspl/api/notice/`, reqbody, tokenConfig(getState))
    .then(res => {
      dispatch({
        type: GET_TYPE_NOTICE,
        payload: res.data
      });
      dispatch(createMessage("Notice Added Successfully", "success"));
    })
    .catch(err => {
      if (!err.response) {
        dispatch(
          createMessage("Network Error. Something went wrong!", "error")
        );
      } else {
        dispatch(createMessage(error.response.data.message, "error"));
      }
    });
};

export const updateNotice = (
  id,
  title,
  body,
  created_on,
  expires_on,
  important
) => (dispatch, getState) => {
  const reqbody = {
    id,
    title,
    body,
    created_on,
    expires_on,
    important
  };
  axios
    .put(`/uspl/api/notice/`, reqbody, tokenConfig(getState))
    .then(res => {
      dispatch({
        type: GET_NOTICE_DETAILS,
        payload: res.data
      });
      dispatch(
        createMessage("Notice Updated Successfully", "success", "top right")
      );
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

export const deleteNotice = id => (dispatch, getState) => {
  axios
    .delete(`/uspl/api/notice/?id=${id}`, tokenConfig(getState))
    .then(res => {
      dispatch({
        type: DELETE_MODAL_SUBMIT_DONE
      });
      dispatch(createMessage("Notice Deleted Successfully", "success"));
    })
    .catch(err => {
      if (!err.response) {
        dispatch(
          createMessage("Network Error. Something went wrong!", "error")
        );
      } else {
        dispatch(createMessage(error.response.status, "error"));
      }
    });
};
