import axios from "axios";
import { GET_TYPE_MEMBERS } from "./types";
import { tokenConfig } from "./auth";
import { createMessage } from "./alerts";

export const getTypeMembers = (type, id) => (dispatch, getState) => {
  dispatch({
    type: GET_TYPE_MEMBERS,
    payload: null
  });
  axios
    .get(`/uspl/api/${type}/members/${id}`, tokenConfig(getState))
    .then(res => {
      dispatch({
        type: GET_TYPE_MEMBERS,
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

export const getUsersFormField = () => (dispatch, getState) => {
  axios
    .put(`/uspl/api/${id}/profile/`, body, tokenConfig(getState))
    .then(res => {
      // dispatch({
      //   type: GET_USER_PROFILE,
      //   payload: res.data
      // });
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
