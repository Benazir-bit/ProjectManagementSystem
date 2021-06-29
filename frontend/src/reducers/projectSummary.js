import { GET_SUMMARY_LIST } from "../actions/types";

const initialState = {
  summarylist: null
};

export default function(state = initialState, action) {
  switch (action.type) {
    case GET_SUMMARY_LIST:
      return {
        ...state,
        summarylist: action.payload
      };
    default:
      return state;
  }
}
