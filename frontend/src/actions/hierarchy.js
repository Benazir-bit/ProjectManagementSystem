import axios from "axios";
import { GET_LINE_MANAGER } from "./types";
import { tokenConfig } from "./auth";
import { createMessage } from "./alerts";

export const getLineMaangerTree = () => (dispatch, getState) => {
  axios
    .get(`/appraisal/api/hierarchy/`, tokenConfig(getState))
    .then(res => {
      // console.log(res.data, "kkkkkkk");
      dispatch({
        type: GET_LINE_MANAGER,
        payload: res.data
      });

      //dispatch(createMessage("Succesfully Sent Appraisal", "success"));
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
