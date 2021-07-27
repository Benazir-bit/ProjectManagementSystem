import axios from "axios";
import {
  GET_TYPE_PROJECTS,
  GET_PROJECT_DETAIL,
  GET_ADMIN_PROJECTS,
  GET_GROUP_PROJECTS,
  DELETE_MODAL_SUBMIT_DONE,
  GET_PROJECT_CHART
} from "./types";
import { tokenConfig } from "./auth";
import { createMessage } from "./alerts";

export const getTypeProjects = (type, filter, id) => (dispatch, getState) => {
  dispatch({
    type: GET_TYPE_PROJECTS,
    payload: null
  });
  axios
    .get(`/uspl/api/${type}/projects/${filter}/${id}`, tokenConfig(getState))
    .then(res => {
      if (type === "group") {
        dispatch({
          type: GET_GROUP_PROJECTS,
          payload: res.data
        });
      }
      if (type === "user") {
        dispatch({
          type: GET_TYPE_PROJECTS,
          payload: res.data
        });
      }
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

export const getAdminDashboardProjects = () => (dispatch, getState) => {
  console.log("getAdminDashboardProjects");
  axios
    .get(`/uspl/api/admin/all/projects/`, tokenConfig(getState))
    .then(res => {
      dispatch({
        type: GET_ADMIN_PROJECTS,
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
export const getprojectchart = (id) => (dispatch, getState) => {
  // dispatch({
  //   type: GET_PROJECT_DETAIL,
  //   payload: null
  // });
  axios
    .get(`/uspl/api/project-chart/${id}`, tokenConfig(getState))
    .then(res => {
      dispatch({
        type: GET_PROJECT_CHART,
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

export const getProjectDetails = id => (dispatch, getState) => {
  dispatch({
    type: GET_PROJECT_DETAIL,
    payload: null
  });
  axios
    .get(`/uspl/api/project/${id}`, tokenConfig(getState))
    .then(res => {
      dispatch({
        type: GET_PROJECT_DETAIL,
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

export const addNewProject = (
  created_by,
  group,
  name,
  details,
  due_date,
  supervisor,
  members,
  note,
  started_date
) => (dispatch, getState) => {
  const body = {
    created_by,
    group,
    name,
    details,
    due_date,
    supervisor,
    members,
    note,
    started_date
  };
  axios
    .post(`/uspl/api/projects/`, body, tokenConfig(getState))
    .then(res => {
      dispatch({
        type: GET_GROUP_PROJECTS,
        payload: res.data
      });
      dispatch(createMessage("Project Added Successfully", "success"));
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

export const updateProject = (
  id,
  name,
  details,
  due_date,
  supervisor,
  members,
  note,
  started_date,

) => (dispatch, getState) => {
  const body = {
    id,
    name,
    details,
    due_date,
    supervisor,
    members,
    note,
    started_date
  };
  axios
    .put(`/uspl/api/projects/`, body, tokenConfig(getState))
    .then(res => {
      dispatch({
        type: GET_PROJECT_DETAIL,
        payload: res.data
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

export const deleteProject = id => (dispatch, getState) => {
  axios
    .delete(`/uspl/api/projects/?id=${id}`, tokenConfig(getState))
    .then(res => {
      dispatch({
        type: DELETE_MODAL_SUBMIT_DONE
      });
      dispatch(createMessage("Project Deleted Successfully", "success"));
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
export const markProjectAsDone = (id, completed) => (dispatch, getState) => {
  const body = {
    id,
    completed
  };
  axios
    .put(`/uspl/api/projects/`, body, tokenConfig(getState))
    .then(res => {
      dispatch(getProjectDetails(id));
      // dispatch({
      //   type: GET_PROJECT_DETAIL,
      //   payload: res.data
      // });
      dispatch(createMessage("Project Completed Successfully", "success"));
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
