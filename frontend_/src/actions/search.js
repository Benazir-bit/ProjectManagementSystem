import { GET_SEARCH_RESULT } from "./types";
import { tokenConfig } from "./auth";
import axios from "axios";
import { createMessage } from "./alerts";
// export const searchData = (search, app, type, filter) => (
//   dispatch,
//   getState
// ) => {
//   const body = {
//     search
//   };
//   axios
//     .put(`${app}/api/${type}/search/${filter}/`, body, tokenConfig(getState))
//     .then(res => {
//       dispatch({
//         type: GET_SEARCH_RESULT,
//         payload: res.data
//       });
//     });
// };

export const searchData = (search, app, type, filter) => (
  dispatch,
  getState
) => {
  const body = {
    search
  };
  axios
    .put(`${app}/api/${type}/search/${filter}/`, body, tokenConfig(getState))
    .then(res => {
      const data = res.data.map(user => ({
        value: user.username,
        username: user.full_name
      }));
      dispatch({
        type: GET_SEARCH_RESULT,
        payload: res.data
      });
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
