import axios from "axios";
import {
  GET_TYPE_TASKS_OVERVIEW,
  GET_TYPE_TASKS,
  GET_TASK_DETAIL,
  GET_PROJECT_DETAIL,
  DELETE_MODAL_SUBMIT_DONE
} from "./types";
import { tokenConfig } from "./auth";
import { createMessage } from "./alerts";

export const getTypeTaskOverview = (type, id) => (dispatch, getState) => {
  dispatch({
    type: GET_TYPE_TASKS_OVERVIEW,
    payload: null
  });
  axios
    .get(`/uspl/api/${type}/tasks/overview/${id}`, tokenConfig(getState))
    .then(res => {
      dispatch({
        type: GET_TYPE_TASKS_OVERVIEW,
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

export const getTypeTasks = (type, filter, id) => (dispatch, getState) => {
  dispatch({
    type: GET_TYPE_TASKS,
    payload: null
  });
  axios
    .get(`/uspl/api/${type}/tasks/${filter}/${id}`, tokenConfig(getState))
    .then(res => {
      dispatch({
        type: GET_TYPE_TASKS,
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

export const getTaskDetails = id => (dispatch, getState) => {
  dispatch({
    type: GET_TASK_DETAIL,
    payload: null
  });
  axios
    .get(`/uspl/api/task/${id}`, tokenConfig(getState))
    .then(res => {
      dispatch({
        type: GET_TASK_DETAIL,
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

export const addNewTask = (
  project,
  name,
  details,
  deadline,
  // due_date,
  assigned_to,
  note
) => (dispatch, getState) => {
  const body = {
    project,
    name,
    details,
    deadline,
    // due_date,
    assigned_to,
    note
  };
  axios
    .post(`/uspl/api/tasks/`, body, tokenConfig(getState))
    .then(res => {
      dispatch(createMessage("Task Added Successfully", "success"));
      dispatch({
        type: GET_TYPE_TASKS,
        payload: res.data.tasks
      });
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

export const addNewUserTask = (
  project,
  name,
  details,
  deadline,
  assigned_to,
  note,
  requested
) => (dispatch, getState) => {
  const body = {
    project,
    name,
    details,
    deadline,
    assigned_to,
    note,
    requested
  };
  axios
    .post(`/uspl/api/tasks/`, body, tokenConfig(getState))
    .then(res => {
      dispatch({
        type: GET_TYPE_TASKS,
        payload: res.data.tasks
      });
      dispatch({
        type: GET_PROJECT_DETAIL,
        payload: res.data
      });
      dispatch(
        createMessage("Task Send to Supervisor Successfully", "success")
      );
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

export const approveTask = body => (dispatch, getState) => {
  axios
    .put(`/uspl/api/tasks/`, body, tokenConfig(getState))
    .then(res => {
      dispatch({
        type: GET_TASK_DETAIL,
        payload: res.data
      });
      dispatch(createMessage("Task has been Successfully approved", "success"));
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

export const startTask = (id, started) => (dispatch, getState) => {
  const body = {
    id,
    started
  };
  axios
    .put(`/uspl/api/tasks/`, body, tokenConfig(getState))
    .then(res => {
      dispatch({
        type: GET_TASK_DETAIL,
        payload: res.data
      });
      dispatch(createMessage("Task Started", "success"));
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

export const resumeTask = (id, resumed, paused) => (dispatch, getState) => {
  const body = {
    id,
    resumed,
    paused
  };
  axios
    .put(`/uspl/api/tasks/`, body, tokenConfig(getState))
    .then(res => {
      dispatch({
        type: GET_TASK_DETAIL,
        payload: res.data
      });
      dispatch(createMessage("Task Resumed", "success"));
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

export const updateTaskNew = body => (dispatch, getState) => {
  axios.put("/uspl/api/tasks/", body, tokenConfig(getState)).then(res => {
    dispatch({
      type: GET_TASK_DETAIL,
      payload: res.data
    });
  });
};

export const submitCancelTask = body => (dispatch, getState) => {
  axios
    .put("/uspl/api/tasks/", body, tokenConfig(getState))
    .then(res => {
      dispatch({
        type: GET_TASK_DETAIL,
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

export const updateTask = (id, name, details, deadline, assigned_to, note) => (
  dispatch,
  getState
) => {
  const body = {
    id,
    name,
    details,
    deadline,
    assigned_to,
    note
  };
  axios
    .put(`/uspl/api/tasks/`, body, tokenConfig(getState))
    .then(res => {
      dispatch({
        type: GET_TASK_DETAIL,
        payload: res.data
      });
      dispatch(createMessage("Task Updated", "success"));
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

export const deleteTask = id => (dispatch, getState) => {
  axios
    .delete(`/uspl/api/tasks/?id=${id}`, tokenConfig(getState))
    .then(res => {
      dispatch({
        type: DELETE_MODAL_SUBMIT_DONE
      });
      dispatch(createMessage("Task Deleted Successfully", "success"));
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

export const submitTask = body => (dispatch, getState) => {
  axios
    .put(`/uspl/api/tasks/`, body, tokenConfig(getState))
    .then(res => {
      dispatch({
        type: GET_TASK_DETAIL,
        payload: res.data
      });
      dispatch(createMessage("Task Submitted Successfully", "success"));
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

export const sendfeedback = (task, body, author) => (dispatch, getState) => {
  const bodyy = {
    task,
    body,
    author
  };
  axios
    .post(`/uspl/api/taskfeedback/`, bodyy, tokenConfig(getState))
    .then(res => {
      dispatch({
        type: GET_TASK_DETAIL,
        payload: res.data
      });
      dispatch(createMessage("Feedback Sent Successfully", "success"));
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

export const markTaskAsDone = (
  task,
  skill,
  attitude,
  motivation,
  communication,
  time_management,
  reliability,
  comment
) => (dispatch, getState) => {
  const body = {
    task,
    skill,
    attitude,
    motivation,
    communication,
    time_management,
    reliability,
    comment
  };
  axios
    .post(`/uspl/api/task/mark-as-done/`, body, tokenConfig(getState))
    .then(res => {
      dispatch({
        type: GET_TASK_DETAIL,
        payload: res.data
      });
      dispatch(createMessage("Task Completed", "success"));
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

export const supervisorTaskDone = (id, completed) => (dispatch, getState) => {
  const body = {
    id,
    completed
  };
  axios
    .put(`/uspl/api/tasks/`, body, tokenConfig(getState))
    .then(res => {
      dispatch({
        type: GET_TASK_DETAIL,
        payload: res.data
      });

      dispatch(createMessage("Task Completed Successfully", "success"));
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
