import {
  GET_GROUP_ATTENDANCE,
  GET_USER_ATTENDANCE,
  GET_USER_NAME,
  LOADING_ATTENDANCE,
  LOADING_COMPLETED,
  GET_ATTENDANCE_CONFIG,
  CLEAR_USER_ATTENDANCE,
  GET_ALL_DAYS
} from "../actions/types";

const initialState = {
  attendance: null,
  users: null,
  user_attendance: null,
  isLoading: false,
  config: null,
  days: null
};

export default function(state = initialState, action) {
  switch (action.type) {
    case LOADING_ATTENDANCE:
      return {
        ...state,
        isLoading: true
      };
    case GET_GROUP_ATTENDANCE:
      return {
        ...state,
        attendance: action.payload,
        isLoading: false
      };
    case GET_USER_ATTENDANCE:
      return {
        ...state,
        user_attendance: action.payload,
        isLoading: false
      };
    case GET_USER_NAME:
      return {
        ...state,
        users: action.payload
      };
    case LOADING_COMPLETED:
      return {
        ...state,
        isLoading: false
      };
    case GET_ALL_DAYS:
      return {
        ...state,
        days: action.payload
      };
    case GET_ATTENDANCE_CONFIG:
      return {
        ...state,
        config: action.payload
      };
    case CLEAR_USER_ATTENDANCE:
      return {
        ...state,
        user_attendance: null
      };
    default:
      return state;
  }
}
