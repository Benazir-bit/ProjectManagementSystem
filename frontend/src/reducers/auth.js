import {
  USER_LOADING,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT_SUCCESS,
  PAGE_LOAD,
  PAGE_LOADED,
  SPLASH_LOAD,
  PASSWORD_VALIDATION,
  TEST
} from "../actions/types";

const initialState = {
  password_valid: false,
  token: localStorage.getItem("token"),
  isAuthenticated: null,
  isLoading: true,
  isSplash: false,
  user: null
};

export default function (state = initialState, action) {
  switch (action.type) {
    case USER_LOADING:
    case PAGE_LOAD:
      return {
        ...state,
        isLoading: true
      };
    case SPLASH_LOAD:
      return {
        ...state,
        isSplash: true
      };
    case PAGE_LOADED:
      return {
        ...state,
        isLoading: false,
        isSplash: false
      };
    case USER_LOADED:
      return {
        ...state,
        isLoading: false,
        isAuthenticated: true,
        user: action.payload
      };
    case LOGIN_SUCCESS:
      localStorage.setItem("token", action.payload.token);
      return {
        ...state,
        ...action.payload,
        isAuthenticated: true,
        isLoading: false
      };
    case LOGIN_FAIL:
    case LOGOUT_SUCCESS:
    case AUTH_ERROR:
      localStorage.removeItem("token");
      return {
        ...state,
        token: null,
        user: null,
        isAuthenticated: false,
        isLoading: false
      };
    case PASSWORD_VALIDATION:
      return {
        ...state,
        password_valid: action.payload
      };
    default:
      return state;
  }
}
