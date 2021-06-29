import { GET_TYPE_MEMBERS } from "../actions/types";

const initialState = {
  members: null
};

export default function(state = initialState, action) {
  switch (action.type) {
    case GET_TYPE_MEMBERS:
      return {
        ...state,
        members: action.payload
      };
    default:
      return state;
  }
}
