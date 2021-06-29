import axios from "axios";
import {
  INFINITY_SCROLL,
  RESET_INFINITY_SCROLL,
  LOADING_ATTENDANCE,
  LOADING_COMPLETED
} from "./types";
import { tokenConfig } from "./auth";

export const resetInfinityScroll = () => dispatch => {
  const body = {
    isLoading: false,
    scrolllisLoading: false,
    data: null,
    count: null,
    offset: 0,
    limit: 5,
    prevData: null
  };
  return dispatch({
    type: RESET_INFINITY_SCROLL,
    payload: body
  });
};

export const getGroupOnScroll = (type, id, date, offset, limit) => (
  dispatch,
  getState
) => {
  // console.log(localStorage.getItem("token"));
  //GET TOKEN FROM STATE
  const token = localStorage.getItem("token");

  let params;
  if (type === "all") {
    params = `qfilter=all&qdate=${date}`;
  } else if (type === "group") {
    params = `qfilter=group&qgroup=${id}&qdate=${date}`;
  }
  //HEADERS
  const config = {
    headers: {
      "Content-Type": "application/json"
    }
  };

  // IF TOKEN AVAILABLE, ADD TO HEADER (AUTHORIZATION)
  if (token) {
    config.headers["Authorization"] = `Token ${token}`;
  }

  dispatch({ type: LOADING_ATTENDANCE });
  axios
    .get(
      `/attendance/api/all?${params}&offset=${offset}&limit=${limit}`,
      tokenConfig(getState)
    )

    .then(res => {
      dispatch({ type: LOADING_COMPLETED });
      dispatch({
        type: INFINITY_SCROLL,
        payload: res.data
      });
    })
    .catch(err => {
      console.log(err);
      // if (!err.response) {
      //   alert("Network Error. timeout exceeded");
      // }
    });
};
