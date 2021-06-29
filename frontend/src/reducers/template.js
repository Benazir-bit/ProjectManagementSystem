import { GET_TEMPLETE_LIST, GET_TEMPLETE } from "../actions/types";

const initialState = {
  templates: null,
  template: null
};

export default function(state = initialState, action) {
  switch (action.type) {
    case GET_TEMPLETE:
      return {
        ...state,
        template: action.payload
      };
    case GET_TEMPLETE_LIST:
      return {
        ...state,
        templates: action.payload
      };
    default:
      return state;
  }
}
