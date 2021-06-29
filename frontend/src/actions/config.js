import axios from "axios";
// import {
//   GET_CONFIG,
// } from "./types";
import { tokenConfig } from "./auth";
import { createMessage } from "./alerts";

export const configAppraisal = body => (dispatch, getState) => {
  axios
    .post(`/uspl/api/config/`, body, tokenConfig(getState))
    .then(res => {
      //   dispatch({
      //     type: GET_APPRAISAL,
      //     payload: res.data
      //   });
      dispatch(createMessage("Succesfully Sent Appraisal", "success"));
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
