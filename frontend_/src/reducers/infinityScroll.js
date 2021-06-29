import {
  INFINITY_SCROLL,
  RESET_INFINITY_SCROLL,
  LOADING_ATTENDANCE,
  LOADING_COMPLETED,
  LOADING_SCROLL
} from "../actions/types";

const initialState = {
  // isLoading: null,
  // data: null,
  // count: null,
  // offset: null,
  // limit: null,
  // prevData: null,
  // scrolllisLoading: null
  //
  isLoading: false,
  data: null,
  count: null,
  offset: 0,
  limit: 5,
  prevData: null,
  scrolllisLoading: false
};

export default function(state = initialState, action) {
  switch (action.type) {
    case LOADING_ATTENDANCE:
      return {
        ...state,
        isLoading: true
      };
    case LOADING_SCROLL:
      return {
        ...state,
        scrolllisLoading: true
      };
    case INFINITY_SCROLL:
      if (state.prevData != action.payload.results) {
        // console.log("REDUCERS", action.payload.results);
        return {
          ...state,
          data: !state.data
            ? action.payload.results
            : [...state.data, ...action.payload.results],
          count: action.payload.count,
          offset: state.offset + state.limit,
          prevData: action.payload.results
        };
      }
    case RESET_INFINITY_SCROLL:
      return {
        isLoading: action.payload.isLoading,
        scrolllisLoading: action.payload.scrolllisLoading,
        data: action.payload.data,
        count: action.payload.count,
        offset: action.payload.offset,
        limit: action.payload.limit,
        prevData: action.payload.prevData
      };
    case LOADING_COMPLETED:
      return {
        ...state,
        isLoading: false,
        scrolllisLoading: false
      };
    default:
      return state;
  }
}
