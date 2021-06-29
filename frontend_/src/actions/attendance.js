import axios from "axios";
import {
  GET_GROUP_ATTENDANCE,
  LOADING_ATTENDANCE,
  GET_USER_NAME,
  GET_USER_ATTENDANCE,
  GET_ATTENDANCE_CONFIG,
  GET_ALL_DAYS,
  UPDATE_ATTENDANCE_CONFIG
} from "./types";
import { tokenConfig } from "./auth";
import { createMessage } from "./alerts";

// CHECK TOKEN & LOAD GROUP USER
export const getGroupAttendance = (type, id, date) => (dispatch, getState) => {
  let params;
  if (type === "all") {
    params = `qfilter=all&qdate=${date}`;
  } else if (type === "group") {
    params = `qfilter=group&qgroup=${id}&qdate=${date}`;
  }

  dispatch({ type: LOADING_ATTENDANCE });
  axios
    .get(`/attendance/api/all?${params}`, tokenConfig(getState))
    .then(res => {
      dispatch({
        type: GET_GROUP_ATTENDANCE,
        payload: res.data
      });
    })
    .catch(err => {});
};

// CHECK TOKEN & LOAD USER
export const getUserAttendance = (type, username, qmonth) => (
  dispatch,
  getState
) => {
  console.log(type, username, qmonth);
  let params;
  if (type === "user") {
    // params = `qfilter=user&user=${id}&from=${from_date}&to=${to_date}`;
    params = `qfilter=user&username=${username}&qmonth=${qmonth}`;
  }
  console.log(params);

  const config = {
    headers: {
      "Content-Type": "application/json"
    }
  };
  dispatch({ type: LOADING_ATTENDANCE });
  axios
    .get(`/attendance/api/all?${params}`, tokenConfig(getState))
    .then(res => {
      console.log(res.data, "responseeeeee");
      dispatch({
        type: GET_USER_ATTENDANCE,
        payload: res.data
        // payload: test_data
      });
    })
    .catch(err => {});
};

export const getSelfAttendance = qmonth => (dispatch, getState) => {
  let params;
  params = `qfilter=self&qmonth=${qmonth}`;

  const config = {
    headers: {
      "Content-Type": "application/json"
    }
  };
  dispatch({ type: LOADING_ATTENDANCE });
  axios
    .get(`/attendance/api/all?${params}`, tokenConfig(getState))
    .then(res => {
      dispatch({
        type: GET_USER_ATTENDANCE,
        payload: res.data
        // payload: test_data
      });
    })
    .catch(err => {});
};

// GET USER NAME
export const getUserName = (search, type, filter) => (dispatch, getState) => {
  const body = {
    search
  };

  axios
    .put(`/accounts/api/${type}/search/${filter}/`, body, tokenConfig(getState))
    .then(res => {
      // const data = res.data.map(user => ({
      //   value: user.username,
      //   username: user.full_name
      // }));
      dispatch({
        type: GET_USER_NAME,
        payload: res.data
      });
    })
    .catch(err => {
      // if (!err.response) {
      //   dispatch(
      //     createMessage("Network Error. Something went wrong!", "error")
      //   );
      // } else {
      //   dispatch(
      //     dispatch(
      //       createMessage(
      //         `${err.response.status} ${err.response.statusText}`,
      //         "error"
      //       )
      //     )
      //   );
      // }
    });
};

// GET CONFIG WORKING HOUR
export const getAllDays = () => (dispatch, getState) => {
  axios
    .get(`/attendance/api/days`, tokenConfig(getState))
    .then(res => {
      dispatch({
        type: GET_ALL_DAYS,
        payload: res.data
      });
    })
    .catch(err => {});
};

export const getAttendanceConfig = () => (dispatch, getState) => {
  console.log("actions getAttendanceConfig");

  axios
    .get(`/attendance/api/settings`, tokenConfig(getState))
    .then(res => {
      dispatch({
        type: GET_ATTENDANCE_CONFIG,
        payload: res.data
      });
    })
    .catch(err => {});
};

export const updateAttendanceConfig = body => (dispatch, getState) => {
  // const body = JSON.stringify(data);
  axios
    .put(`/attendance/api/settings`, body, tokenConfig(getState))
    .then(res => {
      dispatch({
        type: UPDATE_ATTENDANCE_CONFIG,
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
