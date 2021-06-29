import { ALERT_MESSAGE, ERROR_MESSAGE } from "../actions/types";

const initialState = {
  message: {},
  error: null,
  type: null,
  position: null
};

export default function(state = initialState, action) {
  switch (action.type) {
    case ERROR_MESSAGE:
      return {
        ...state,
        error: action.payload
      };
    case ALERT_MESSAGE:
      return {
        ...state,
        error: action.payload,
        type: action.payload.type
      };
    default:
      return state;
  }
}
