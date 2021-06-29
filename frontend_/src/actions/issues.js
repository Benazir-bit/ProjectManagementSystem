import axios from "axios";
import { GET_TYPE_ISSUES, GET_ISSUE_DETAIL, GET_TASK_DETAIL } from "./types";
import { tokenConfig } from "./auth";
import { createMessage } from "./alerts";
export const getIssueDetails = id => (dispatch, getState) => {
  dispatch({
    type: GET_ISSUE_DETAIL,
    payload: null
  });
  axios
    .get(`/uspl/api/issue/${id}`, tokenConfig(getState))
    .then(res => {
      dispatch({
        type: GET_ISSUE_DETAIL,
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

export const getTypeIssues = (type, filter, id, offset, limit) => (
  dispatch,
  getState
) => {
  dispatch({
    type: GET_TYPE_ISSUES,
    payload: null
  });
  let api_link;
  if ((offset == null) & (limit == null)) {
    api_link = `/uspl/api/${type}/issues/${filter}/${id}`;
  } else {
    api_link = `/uspl/api/${type}/issues/${filter}/${id}?offset=${offset}&limit=${limit}`;
  }
  axios
    .get(api_link, tokenConfig(getState))
    .then(res => {
      dispatch({
        type: GET_TYPE_ISSUES,
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

export const getInfiniteIssues = (type, filter, id) => (dispatch, getState) => {
  let api_link;
  api_link = `/uspl/api/issues/?type=${type}&filter=${filter}&id=${id}&offset=${20}&limit=${10}`;
  axios
    .get(api_link, tokenConfig(getState))
    .then(res => {
      dispatch({
        type: GET_TYPE_ISSUES,
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

export const commnentIssue = (issue, author, body) => (dispatch, getState) => {
  const bodyy = {
    issue,
    author,
    body
  };
  axios
    .post(`/uspl/api/issuecomment/`, bodyy, tokenConfig(getState))
    .then(res => {
      dispatch({
        type: GET_ISSUE_DETAIL,
        payload: res.data
      });
      dispatch(createMessage("Comment Added Successfully", "success"));
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

export const raiseIssue = (task, name, details, raised_by, important) => (
  dispatch,
  getState
) => {
  const body = {
    task,
    name,
    details,
    raised_by,
    important
  };
  axios
    .post(`/uspl/api/issue/`, body, tokenConfig(getState))
    .then(res => {
      dispatch({
        type: GET_TASK_DETAIL,
        payload: res.data
      });
      dispatch(createMessage("Raised Issue", "success"));
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
export const markasSolution = (
  issue,
  id,
  solution,
  solved,
  solved_by,
  marked_as_solution
) => (dispatch, getState) => {
  const body = {
    issue,
    id,
    solution,
    solved,
    solved_by,
    marked_as_solution
  };
  axios
    .put(`/uspl/api/issue/`, body, tokenConfig(getState))
    .then(res => {
      dispatch({
        type: GET_ISSUE_DETAIL,
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
