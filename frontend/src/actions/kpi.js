import axios from "axios";
import { GET_EMPLOYEE_YEAR_KPI, GET_KPI_DETAILS } from "./types";
import { tokenConfig } from "./auth";
import { createMessage } from "./alerts";

export const getEmployeeYearlyKPI = (id, year) => (dispatch, getState) => {
  axios
    .get(`/uspl/api/${id}/kpi_list/${year}/`, tokenConfig(getState))
    .then(res => {
      dispatch({
        type: GET_EMPLOYEE_YEAR_KPI,
        payload: res.data
      });
    })
    .catch(err => {
      if (!err.response) {
        dispatch(
          createMessage("Network Error. Something went wrong!", "error")
        );
      } else {
        dispatch(createMessage(`${err.response.status} ${err.response.statusText}`, "error"));
      }
    });
};

export const getKPIDetails = id => (dispatch, getState) => {
  axios
    .get(`/uspl/api/kpi/${id}`, tokenConfig(getState))
    .then(res => {
      dispatch({
        type: GET_KPI_DETAILS,
        payload: res.data
      });
    })
    .catch(err => {
      if (!err.response) {
        dispatch(
          createMessage("Network Error. Something went wrong!", "error")
        );
      } else {
        dispatch(createMessage(`${err.response.status} ${err.response.statusText}`, "error"));
      }
    });
};
