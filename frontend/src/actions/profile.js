import axios from "axios";
import {
  GET_USER_PROFILE,
  GET_USER_AVG_KPI,
  USER_LOADED,
  GET_DASH_PANEL_DATA,
  GET_TYPE_MEMBERS,
  GET_ROLES
} from "./types";
import { tokenConfig } from "./auth";
import { createMessage } from "./alerts";
import { getLineMaangerTree } from "./hierarchy";
export const getRoles = () => (dispatch, getState) => {
  axios
    .get(`/uspl/api/roles`, tokenConfig(getState))
    .then(res => {
      dispatch({
        type: GET_ROLES,
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
export const getUserProfile = id => (dispatch, getState) => {
  axios
    .get(`/uspl/api/${id}/profile/`, tokenConfig(getState))
    .then(res => {
      dispatch({
        type: GET_USER_PROFILE,
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

export const uploadProfilePhoto = (id, formData) => (dispatch, getState) => {
  axios
    .put(`/uspl/api/${id}/profile/`, formData, tokenPhotoConfig(getState))
    .then(res => {
      dispatch({
        type: GET_USER_PROFILE,
        payload: res.data.profile
      });
      dispatch({
        type: USER_LOADED,
        payload: res.data.user
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

// User Update
export const updateUser = body => (dispatch, getState) => {
  axios
    .put(`/uspl/api/user/`, body, tokenConfig(getState))
    .then(res => {
      dispatch({
        type: GET_TYPE_MEMBERS,
        payload: res.data.userall
      });
      dispatch(createMessage(res.data.message, "success"));
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
// Profile Update
export const updateProfile = (id, body) => (dispatch, getState) => {
  axios
    .put(`/uspl/api/${id}/profile/`, body, tokenConfig(getState))
    .then(res => {
      if (body.organogram) {
        dispatch(getLineMaangerTree());
      } else {
        dispatch({
          type: GET_USER_PROFILE,
          payload: res.data.profile
        });
      }

      dispatch(createMessage("User Profile Updated Successfully", "success"));
    })
    .catch(err => {
      if (!err.response) {
        dispatch(
          createMessage("Network Error. Something went wrong!", "error")
        );
      } else {
        dispatch(createMessage("Error in User Profile", "error"));
      }
    });
};

export const updatePassword = body => (dispatch, getState) => {
  axios
    .put(`/uspl/api/reset-password/`, body, tokenConfig(getState))
    .then(res => {
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

export const getUserAvgKPI = (id, year) => (dispatch, getState) => {
  axios
    .get(`/uspl/api/${id}/kpi_avg/${year}/`, tokenConfig(getState))
    .then(res => {
      dispatch({
        type: GET_USER_AVG_KPI,
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

export const getDashPanelData = () => (dispatch, getState) => {
  dispatch({
    type: GET_DASH_PANEL_DATA,
    payload: null
  });
  axios
    .get("/uspl/api/dashboard/panel/", tokenConfig(getState))
    .then(res => {
      dispatch({
        type: GET_DASH_PANEL_DATA,
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

// User Create
export const createUser = body => (dispatch, getState) => {
  axios
    .post(`/uspl/api/user/`, body, tokenConfig(getState))
    .then(res => {
      dispatch(createMessage(res.data.message, "success"));
    })
    .catch(err => {
      if (!err.response) {
        dispatch(
          createMessage("Network Error. Something went wrong!", "error")
        );
      } else {
        dispatch(
          createMessage(
            "Error On Create! Please Check the Employee Id Already Exist or Not!",
            "error"
          )
        );
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
