import {
  DELETE_MODAL_SUBMIT_DONE,
  MODAL_DELETE_COMPLETE
} from "../actions/types";

const initialState = {
  success: false
};

export default function(state = initialState, action) {
  switch (action.type) {
    case DELETE_MODAL_SUBMIT_DONE:
      return {
        ...state,
        success: true
      };
    case MODAL_DELETE_COMPLETE:
      return {
        ...state,
        success: false
      };
    default:
      return state;
  }
}
