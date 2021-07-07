import axios from "axios";
import {
  GET_TYPE_NEWS,
  LOADING_SCROLL,
  LOADING_COMPLETED,
  RESET_NEWS
} from "./types";
import { tokenConfig } from "./auth";

export const resetNewsInfinityScroll = () => dispatch => {
  const body = {
    isLoading: false,
    scrolllisLoading: false,
    data: 0,
    count: null,
    offset: 0,
    limit: 5,
    prevData: null
  };
  return dispatch({
    type: RESET_NEWS,
    payload: body
  });
};

export const getTypeNews = (type, id, offset, limit) => (
  dispatch,
  getState
) => {
  // console.log(localStorage.getItem("token"));
  //GET TOKEN FROM STATE
  const token = localStorage.getItem("token");

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

  dispatch({ type: LOADING_SCROLL });
  axios
    .get(
      `/uspl/api/news/${type}/${id}?offset=${offset}&limit=${limit}`,
      // {
      //   timeout: 5000
      // },
      tokenConfig(getState)
    )

    .then(res => {
      console.log(res.data, "response");
      dispatch({ type: LOADING_COMPLETED });
      dispatch({
        type: GET_TYPE_NEWS,
        payload: res.data
      });
      // dispatch({
      //   type: GET_TYPE_NEWS,
      //   payload: res.data
      // });
    })
    .catch(err => {
      console.log(err);
      // if (!err.response) {
      //   alert("Network Error. timeout exceeded");
      // }
    });
};
