import axios from "axios";
import {
  GET_GROUP_DETAILS,
  GET_TYPE_GROUPS,
  GET_TYPE_TASKS_OVERVIEW
} from "./types";
import { tokenConfig } from "./auth";
import { errorMessage } from "./alerts";
import { createMessage } from "./alerts";

export const getGroupDetails = id => (dispatch, getState) => {
  dispatch({
    type: GET_TYPE_TASKS_OVERVIEW,
    payload: null
  });
  axios
    .get(`/uspl/api/group/${id}/`, tokenConfig(getState))
    .then(res => {
      dispatch({
        type: GET_GROUP_DETAILS,
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

export const addTeamleader = body => (dispatch, getState) => {
  axios
    .post(`/uspl/api/groups/teamleader/`, body, tokenConfig(getState))
    .then(res => {
      dispatch({
        type: GET_TYPE_GROUPS,
        payload: res.data
      });
      dispatch(createMessage("Team Leader Added", "success"));
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
export const getGroupListAll = () => (dispatch, getState) => {
  axios
    .get(`/uspl/api/groups-all/`, tokenConfig(getState))
    .then(res => {
      dispatch({
        type: GET_TYPE_GROUPS,
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

export const getGroupList = () => (dispatch, getState) => {
  dispatch({
    type: GET_TYPE_GROUPS,
    payload: null
  });
  axios
    .get(`/uspl/api/groups/`, tokenConfig(getState))
    .then(res => {
      dispatch({
        type: GET_TYPE_GROUPS,
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
export const AddGroup = body => (dispatch, getState) => {
  axios
    .post(`/uspl/api/groups/`, body, tokenConfig(getState))
    .then(res => {
      dispatch({
        type: GET_TYPE_GROUPS,
        payload: res.data.groupall
      });
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
            `${err.response.status} ${err.response.statusText}`,
            "error"
          )
        );
      }
    });
};

export const UpdateGroup = body => (dispatch, getState) => {
  axios
    .put(`/uspl/api/groups/`, body, tokenConfig(getState))
    .then(res => {
      dispatch({
        type: GET_TYPE_GROUPS,
        payload: res.data
      });
      dispatch(createMessage("Group Updated", "success"));
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

export const DeleteGroup = id => (dispatch, getState) => {
  axios
    .delete(`/uspl/api/groups/?id=${id}`, tokenConfig(getState))
    .then(res => {
      dispatch({
        type: GET_TYPE_GROUPS,
        payload: res.data
      });
      dispatch(createMessage("Group Deleted", "success"));
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
