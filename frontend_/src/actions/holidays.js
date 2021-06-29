import axios from "axios";
import { GET_HOLIDAY_DATA } from "./types";
import { tokenConfig } from "./auth";
import { createMessage } from "./alerts";

export const getHolidayData = year => (dispatch, getState) => {
  axios
    .get(`/attendance/api/holidays?year=${year}`, tokenConfig(getState))
    .then(res => {
      dispatch({
        type: GET_HOLIDAY_DATA,
        payload: res.data
      });
    })
    .catch(err => {
      console.log(err);
      //   if (!err.response) {
      //     dispatch(
      //       createMessage("Network Error. Something went wrong!", "error")
      //     );
      //   } else {
      //     dispatch(
      //       createMessage(
      //         `${err.response.status} ${err.response.statusText}`,
      //         "error"
      //       )
      //     );
    });
};

// post new holidays
export const postHoliday = body => (dispatch, getState) => {
  axios
    .post(`/attendance/api/holidays`, body, tokenConfig(getState))
    .then(res => {
      dispatch({
        type: GET_HOLIDAY_DATA,
        payload: res.data.holidays
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

// edit prev holidays
export const updateHoliday = body => (dispatch, getState) => {
  axios
    .put(`/attendance/api/holidays`, body, tokenConfig(getState))
    .then(res => {
      dispatch({
        type: GET_HOLIDAY_DATA,
        payload: res.data.holidays
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

// delete holiday
export const deleteHoliday = id => (dispatch, getState) => {
  axios
    .delete(
      `/attendance/api/holidays?id=${id}&range=${
        typeof id == "object" ? true : false
      }`,
      tokenConfig(getState)
    )
    .then(res => {
      dispatch({
        type: GET_HOLIDAY_DATA,
        payload: res.data.holidays
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
