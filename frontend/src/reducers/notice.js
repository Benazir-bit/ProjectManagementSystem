import { GET_TYPE_NOTICE, GET_NOTICE_DETAILS } from "../actions/types";

const initialState = {
  notices: null,
  notice: null
};

export default function(state = initialState, action) {
  switch (action.type) {
    case GET_TYPE_NOTICE:
      return {
        ...state,
        notices: action.payload
      };
    case GET_NOTICE_DETAILS:
      return {
        ...state,
        notice: action.payload
      };
    default:
      return state;
  }
}
