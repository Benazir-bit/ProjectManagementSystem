import {
  GET_WEEKLY_REPORT,
  GET_INBOX_DATA_NEXT,
  GET_INBOX_DATA_PREV,
  LOADING_INBOX_DATA,
  LOADING_COMPLETED_INBOX_DATA,
  RESET_INBOX_DATA,
  GET_SENT_DATA_NEXT,
  GET_SENT_DATA_PREV,
  REPORT_SENT_SUCCESS
} from "../actions/types";

const initialState = {
  weekly_report_sent: null,
  isLoading_sent: false,
  data_sent: null,
  count_sent: null,
  offset_sent: 0,
  limit_sent: 1,
  prevData_sent: null,
  pageNumber_sent: 1,
  weekly_report_inbox: null,
  isLoading: false,
  data_inbox: null,
  count_inbox: null,
  offset_inbox: 0,
  limit_inbox: 1,
  prevData_inbox: null,
  pageNumber_inbox: 1,
  submit: false
};

export default function(state = initialState, action) {
  switch (action.type) {
    case GET_WEEKLY_REPORT:
      return {
        ...state,
        weekly_report: action.payload
      };
    case REPORT_SENT_SUCCESS:
      return {
        ...state,
        submit: action.payload
      };
    case LOADING_INBOX_DATA:
      return {
        ...state,
        isLoading: true,
        isLoading_inbox: true
      };
    case GET_INBOX_DATA_NEXT:
      // console.log("Inside Reducers GET_INBOX_DATA_NEXT");
      if (state.prevData != action.payload.results) {
        // console.log("REDUCERSSSSS", action.payload.results);
        return {
          ...state,
          // data: !state.data
          //   ? action.payload.results
          //   : [...state.data, ...action.payload.results],
          data_inbox: action.payload.results,
          count_inbox: action.payload.count,
          offset_inbox: action.payload.offset,
          // offset: state.offset + state.limit,
          pageNumber_inbox: action.payload.pageNumber,
          prevData_inbox: action.payload.results
        };
      }
    case GET_INBOX_DATA_PREV:
      // console.log("Inside Reducers GET_INBOX_DATA_PREV");
      if (state.prevData != action.payload.results) {
        // console.log("REDUCERSSSSS", action.payload.results);
        return {
          ...state,
          // data: !state.data
          //   ? action.payload.results
          //   : [...state.data, ...action.payload.results],
          data_inbox: action.payload.results,
          count_inbox: action.payload.count,
          offset_inbox: action.payload.offset,
          // offset: state.offset - state.limit,
          pageNumber_inbox: action.payload.pageNumber,
          prevData_inbox: action.payload.results
        };
      }
    case GET_SENT_DATA_NEXT:
      // console.log("Inside Reducers GET_INBOX_DATA_NEXT");
      if (state.prevData != action.payload.results) {
        // console.log("REDUCERSSSSS", action.payload.results);
        return {
          ...state,
          // data: !state.data
          //   ? action.payload.results
          //   : [...state.data, ...action.payload.results],
          data_sent: action.payload.results,
          count_sent: action.payload.count,
          offset_sent: action.payload.offset,
          // offset: state.offset + state.limit,
          pageNumber_sent: action.payload.pageNumber,
          prevData_sent: action.payload.results
        };
      }
    case GET_SENT_DATA_PREV:
      // console.log("Inside Reducers GET_INBOX_DATA_PREV");
      if (state.prevData != action.payload.results) {
        // console.log("REDUCERSSSSS", action.payload.results);
        return {
          ...state,
          // data: !state.data
          //   ? action.payload.results
          //   : [...state.data, ...action.payload.results],
          data_sent: action.payload.results,
          count_sent: action.payload.count,
          offset_sent: action.payload.offset,
          // offset: state.offset - state.limit,
          pageNumber_sent: action.payload.pageNumber,
          prevData_sent: action.payload.results
        };
      }
    case RESET_INBOX_DATA:
      console.log("Reset Reducers...............");
      return {
        weekly_report_sent: null,
        isLoading_sent: false,
        data_sent: null,
        count_sent: null,
        offset_sent: 0,
        limit_sent: 2,
        prevData_sent: null,
        pageNumber_sent: 1,
        weekly_report_inbox: null,
        isLoading_inbox: false,
        data_inbox: null,
        count_inbox: null,
        offset_inbox: 0,
        limit_inbox: 2,
        prevData_inbox: null,
        pageNumber_inbox: 1
      };
    case LOADING_COMPLETED_INBOX_DATA:
      return {
        ...state,
        isLoading: false,
        isLoading_inbox: false
      };
    default:
      return state;
  }
}
