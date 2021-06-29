import axios from "axios";
import { GET_SUMMARY_LIST } from "./types";
import { tokenConfig } from "./auth";
export const getSummaryList = (group, from_date, to_date, emp_id) => (
  dispatch,
  getState
) => {
  const config = {
    headers: {
      "Content-Type": "application/json"
    }
  };
  axios
    .get(
      `/uspl/api/summary/?group_id=${group}&&from_date=${from_date}&&to_date=${to_date}&&emp_id=${emp_id}`,
      tokenConfig(getState)
    )
    .then(res => {
      console.log("response", res.data);
      dispatch({
        type: GET_SUMMARY_LIST,
        payload: res.data
      });
    })
    .catch(err => {});
};
