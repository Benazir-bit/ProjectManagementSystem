import axios from "axios";
import { GET_NOTIFICATIONS } from "./types";
import { tokenConfig } from "./auth";

export const getNotifications = () => (dispatch, getState) => {
  axios
    .get(`/notifications/api/tray-ntfs/`, tokenConfig(getState))
    .then(res => {
      //console.log(res.data)
      dispatch({
        type: GET_NOTIFICATIONS,
        payload: res.data
      });
    });
  // .catch(err => {
  //   if (!err.response) {
  //     dispatch(
  //       createMessage("Network Error. Something went wrong!", "error")
  //     );
  //   } else {
  //     dispatch(createMessage(`${err.response.status} ${err.response.statusText}`, "error"));
  //   }
  // });
};
