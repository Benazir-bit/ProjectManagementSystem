import axios from "axios";
import { GET_DESIGNATIONS } from "./types";

import { tokenConfig } from "./auth";
import { createMessage } from "./alerts";

export const getAllDesignations = type => (dispatch, getState) => {
  axios
    .get(`/uspl/api/designations/?qtype=${type}`, tokenConfig(getState))
    .then(res => {
      dispatch({
        type: GET_DESIGNATIONS,
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
            `${err.response.data.message} ${err.response.statusText}`,
            "error"
          )
        );
      }
    });
};
export const AddDesignation = body => (dispatch, getState) => {
  axios
    .post("/uspl/api/designations/", body, tokenConfig(getState))
    .then(res => {
      dispatch({
        type: GET_DESIGNATIONS,
        payload: res.data
      });
      dispatch(createMessage("Designation Added Successfully", "success"));
    })
    .catch(err => {
      if (!err.response) {
        dispatch(
          createMessage("Network Error. Something went wrong!", "error")
        );
      } else {
        dispatch(createMessage("Designation Not Added", "error"));
        // dispatch(createMessage(`${err.response.status} ${err.response.statusText}`, "error"));
      }
    });
};
export const UpdateDesignation = body => (dispatch, getState) => {
  axios
    .put("/uspl/api/designations/", body, tokenConfig(getState))
    .then(res => {
      dispatch({
        type: GET_DESIGNATIONS,
        payload: res.data
      });
      dispatch(createMessage("Designation Updated Successfully", "success"));
    })
    .catch(err => {
      if (!err.response) {
        dispatch(
          createMessage("Network Error. Something went wrong!", "error")
        );
      } else {
        dispatch(createMessage("Designation Not Updated", "error"));
      }
    });
};
export const DeleteDesignation = id => (dispatch, getState) => {
  axios
    .delete(`/uspl/api/designations/?id=${id}`, tokenConfig(getState))
    .then(res => {
      dispatch({
        type: GET_DESIGNATIONS,
        payload: res.data
      });
      dispatch(createMessage("Designation Deleted Successfully", "success"));
    })
    .catch(err => {
      if (!err.response) {
        dispatch(
          createMessage("Network Error. Something went wrong!", "error")
        );
      } else {
        dispatch(createMessage("Designation Deleted Not Successful", "error"));
      }
    });
};

// SETUP CONFIG WITH TOKEN - HELPER FUNCTION
export const tokenPhotoConfig = getState => {
  //GET TOKEN FROM STATE
  const token = getState().auth.token;

  //HEADERS
  const config = {
    headers: {
      "content-type": "multipart/form-data"
    }
  };

  // IF TOKEN AVAILABLE, ADD TO HEADER (AUTHORIZATION)
  if (token) {
    config.headers["Authorization"] = `Token ${token}`;
  }

  return config;
};
