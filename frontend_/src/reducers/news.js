import { GET_TYPE_NEWS, RESET_NEWS } from "../actions/types";

const initialState = {
  // isLoading: false,
  // data: null,
  // count: null,
  // offset: 0,
  // limit: 5,
  // prevData: null,
  // scrolllisLoading: false
  isLoading: null,
  data: null,
  count: null,
  offset: null,
  limit: null,
  prevData: null,
  scrolllisLoading: null
};

export default function(state = initialState, action) {
  switch (action.type) {
    case GET_TYPE_NEWS:
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
    case RESET_NEWS:
      return {
        isLoading: false,
        data: null,
        count: null,
        offset: 0,
        limit: 5,
        prevData: null,
        scrolllisLoading: false
      };
    // return {
    //   ...state,
    //   news_feed: action.payload
    // };
    default:
      return state;
  }
}
