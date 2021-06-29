import axios from "axios";
import { GET_TEMPLETE_LIST, GET_TEMPLETE } from "./types";
import { tokenConfig } from "./auth";
import { createMessage } from "./alerts";

export const updateTemplate = body => (dispatch, getState) => {
  axios
    .put(`/appraisal/api/template/`, body, tokenConfig(getState))
    .then(res => {
      dispatch(createMessage("Template Added Successfully", "success"));
    })
    .catch(err => {
      if (!err.response) {
        dispatch(
          createMessage("Network Error. Something went wrong!", "error")
        );
      } else {
        dispatch(
          dispatch(
            createMessage(
              `${err.response.status} ${err.response.statusText}`,
              "error"
            )
          )
        );
      }
    });
};

export const postTemplate = body => (dispatch, getState) => {
  axios
    .post(`/appraisal/api/template/`, body, tokenConfig(getState))
    .then(res => {
      dispatch(createMessage("Template Added Successfully", "success"));
    })
    .catch(err => {
      if (!err.response) {
        dispatch(
          createMessage("Network Error. Something went wrong!", "error")
        );
      } else {
        dispatch(
          dispatch(
            createMessage(
              `${err.response.status} ${err.response.statusText}`,
              "error"
            )
          )
        );
      }
    });
};
export const getTemplate = id => (dispatch, getState) => {
  dispatch({
    type: GET_TEMPLETE,
    payload: null
  });
  axios
    .get(`/appraisal/api/template/?id=${id}`, tokenConfig(getState))
    .then(res => {
      dispatch({
        type: GET_TEMPLETE,
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
          dispatch(
            createMessage(
              `${err.response.status} ${err.response.statusText}`,
              "error"
            )
          )
        );
      }
    });
};

export const deleteTemplate = id => (dispatch, getState) => {
  axios
    .delete(`/appraisal/api/template/?id=${id}`, tokenConfig(getState))
    .then(res => {
      dispatch(createMessage(res.data.message, res.data.status));
      dispatch(getTempleteList("all"));
    })
    .catch(err => {
      if (!err.response) {
        dispatch(
          createMessage("Network Error. Something went wrong!", "error")
        );
      } else {
        dispatch(
          dispatch(
            createMessage(
              `${err.response.status} ${err.response.statusText}`,
              "error"
            )
          )
        );
      }
    });
};

export const getTempleteList = type => (dispatch, getState) => {
  dispatch({
    type: GET_TEMPLETE_LIST,
    payload: null
  });
  axios
    .get(`/appraisal/api/template/?type=${type}`, tokenConfig(getState))
    .then(res => {
      dispatch({
        type: GET_TEMPLETE_LIST,
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
          dispatch(
            createMessage(
              `${err.response.status} ${err.response.statusText}`,
              "error"
            )
          )
        );
      }
    });
};
