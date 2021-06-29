import { GET_LINE_MANAGER } from "../actions/types";

const initialState = {
  heirarchy_chart: null
};

export default function(state = initialState, action) {
  switch (action.type) {
    case GET_LINE_MANAGER:
      return {
        ...state,
        heirarchy_chart: action.payload
      };

    default:
      return state;
  }
}
