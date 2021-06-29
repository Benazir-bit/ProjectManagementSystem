import { MODAL_DELETE_COMPLETE, FORM_SUBMIT_COMPLETE } from "./types";

export const deleteComplete = () => dispatch => {
  dispatch({
    type: MODAL_DELETE_COMPLETE
  });
};

// export const formComplete = () => dispatch => {
//   dispatch({
//     type: FORM_SUBMIT_COMPLETE
//   });
// };
