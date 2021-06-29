import axios from "axios";
import {
  GET_WEEKLY_REPORT,
  GET_INBOX_DATA_NEXT,
  GET_INBOX_DATA_PREV,
  LOADING_INBOX_DATA,
  LOADING_COMPLETED_INBOX_DATA,
  RESET_INBOX_DATA,
  GET_SENT_DATA_NEXT,
  GET_SENT_DATA_PREV,
  REPORT_SENT_SUCCESS
} from "./types";
import { tokenConfig } from "./auth";
import { createMessage } from "./alerts";

export const sendReport = body => (dispatch, getState) => {
  axios
    .post(`/weekly_status/api/weeklystatusreport/`, body, tokenConfig(getState))
    .then(res => {
      console.log(res.data);
      dispatch(createMessage("Report Successfully Sent", "success"));
      dispatch({
        type: REPORT_SENT_SUCCESS,
        payload: true
      });
    })
    .catch(err => {
      console.log(err.response);
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

export const resetInboxData = () => dispatch => {
  return dispatch({ type: RESET_INBOX_DATA });
};
export const fetchInboxData = (offset, limit, pageNumber, fetchNext, type) => (
  dispatch,
  getState
) => {
  dispatch({ type: LOADING_INBOX_DATA });
  // dispatch(resetInboxData());
  axios
    .get(
      `/weekly_status/api/weeklystatusreportlist/?type=${type}&&offset=${offset}&&limit=${limit}`,
      tokenConfig(getState)
    )
    .then(res => {
      dispatch({ type: LOADING_COMPLETED_INBOX_DATA });
      if (type == "inbox") {
        dispatch({
          type: fetchNext ? GET_INBOX_DATA_NEXT : GET_INBOX_DATA_PREV,
          payload: {
            results: res.data.results,
            count: res.data.count,
            pageNumber: pageNumber,
            offset: offset
          }
        });
      } else if (type == "sent") {
        dispatch({
          type: fetchNext ? GET_SENT_DATA_NEXT : GET_SENT_DATA_PREV,
          payload: {
            results: res.data.results,
            count: res.data.count,
            pageNumber: pageNumber,
            offset: offset
          }
        });
      }
    })
    .catch(err => {
      console.log(err.response);
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
export const report = (type, id) => (dispatch, getState) => {
  axios
    .get(
      `/weekly_status/api/weeklystatusreport/?type=${type}&&id=${id}`,
      tokenConfig(getState)
    )
    .then(res => {
      console.log(res.data, "hhhhhhh");
      dispatch({
        type: GET_WEEKLY_REPORT,
        payload: res.data
      });
    })
    .catch(err => {
      console.log(err.response);
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
export const searchDraft = type => (dispatch, getState) => {
  dispatch({
    type: REPORT_SENT_SUCCESS,
    payload: false
  });
  axios
    .get(
      `/weekly_status/api/weeklystatusreport/?type=${type}`,
      tokenConfig(getState)
    )
    .then(res => {
      console.log(res.data, "hhhhhhh");
      dispatch({
        type: GET_WEEKLY_REPORT,
        payload: res.data
      });
    })
    .catch(err => {
      console.log(err.response);
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
export const draftReport = body => (dispatch, getState) => {
  axios
    .put(`/weekly_status/api/weeklystatusreport/`, body, tokenConfig(getState))
    .then(res => {
      console.log(res.data);
      dispatch(createMessage("Report Saved to Draft", "success"));
      //   dispatch(createMessage("Task Added Successfully", "success"));
      //   dispatch({
      //     type: GET_PROJECT_DETAIL,
      //     payload: res.data
      //   });
    })
    .catch(err => {
      console.log(err.response);
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
