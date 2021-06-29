import { GET_ALL_GROUPS } from "../actions/types";

const initialState = {
  groups: null
};

export default function(state = initialState, action) {
  switch (action.type) {
    case GET_ALL_GROUPS:
      return {
        ...state,
        groups: action.payload
      };
    default:
      return state;
  }
}
