import { GET_GROUP_DETAILS, GET_TYPE_GROUPS } from "../actions/types";

const initialState = {
  group: null,
  allgroup: null
};

export default function (state = initialState, action) {
  switch (action.type) {
    case GET_GROUP_DETAILS:
      return {
        ...state,
        group: action.payload
      };
    case GET_TYPE_GROUPS:
      return {
        ...state,
        allgroup: action.payload
      };
    default:
      return state;
  }
}
