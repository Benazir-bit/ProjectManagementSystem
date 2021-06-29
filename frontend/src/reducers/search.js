import { GET_SEARCH_RESULT } from "../actions/types";

const initialState = {
  searchList: []
};
export default function(state = initialState, action) {
  switch (action.type) {
    case GET_SEARCH_RESULT:
      return {
        ...state,
        searchList: action.payload
      };

    default:
      return state;
  }
}
