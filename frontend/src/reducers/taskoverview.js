import { GET_TYPE_TASKS_OVERVIEW } from "../actions/types";

const initialState = {
  overview: null
};

export default function(state = initialState, action) {
  switch (action.type) {
    case GET_TYPE_TASKS_OVERVIEW:
      return {
        ...state,
        overview: action.payload
      };
    default:
      return state;
  }
}
