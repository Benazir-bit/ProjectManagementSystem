import axios from "axios";
import { GET_ALL_GROUPS } from "./types";
import { tokenConfig } from "./auth";
export const getGroupListAll = () => (dispatch, getState) => {
  axios
    .get(`/uspl/api/groups-all/`, tokenConfig(getState))
    .then(res => {
      dispatch({
        type: GET_ALL_GROUPS,
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
