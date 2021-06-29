import {
  GET_APPRAISAL,
  GET_USER_NAME,
  GET_APPRAISAL_VALID,
  GET_APPRAISAL_VIEW,
  GET_APPRAISALCYCLE_LIST,
  GET_APPRAISALLIST,
  GET_APPRAISAL_FORMSLIST,
  GET_APPRAISAL_FORREVIEWS,
  ERROR_FORBIDDEN,
  GET_RESPONSE
} from "../actions/types";

const initialState = {
  appraisal: null,
  users: null,
  appraisal_valid: null,
  appraisallist: null,
  appraisal_view: null,
  appraisal_cycle: null,
  appraisal_form_list: null,
  appraisal_for_review: null,
  error_forbidden: false,
  response:false
};

export default function(state = initialState, action) {
  switch (action.type) {
    case GET_RESPONSE:
      return {
        ...state,
        response: action.payload
      };
    case ERROR_FORBIDDEN:
      return {
        ...state,
        error_forbidden: action.payload
      };
    case GET_APPRAISAL_FORREVIEWS:
      return {
        ...state,
        appraisal_for_review: action.payload
      };
    case GET_APPRAISAL_FORMSLIST:
      return {
        ...state,
        appraisal_form_list: action.payload
      };
    case GET_APPRAISAL:
      return {
        ...state,
        appraisal: action.payload
      };
    case GET_APPRAISALCYCLE_LIST:
      return {
        ...state,
        appraisal_cycle: action.payload
      };
    case GET_APPRAISAL_VIEW:
      return {
        ...state,
        appraisal_view: action.payload
      };
    case GET_APPRAISALLIST:
      return {
        ...state,
        appraisallist: action.payload
      };
    case GET_USER_NAME:
      return {
        ...state,
        users: action.payload
      };
    case GET_APPRAISAL_VALID:
      return {
        ...state,
        appraisal_valid: action.payload
      };
    default:
      return state;
  }
}
