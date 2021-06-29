import {
  GET_USER_PROFILE,
  GET_USER_AVG_KPI,
  GET_DASH_PANEL_DATA,
  GET_ROLES
} from "../actions/types";

const initialState = {
  profile: null,
  avg_kpi: null,
  panel_data: null,
  roles: null
};

export default function(state = initialState, action) {
  switch (action.type) {
    case GET_USER_PROFILE:
      return {
        ...state,
        profile: action.payload
      };
    case GET_USER_AVG_KPI:
      return {
        ...state,
        avg_kpi: action.payload
      };
    case GET_ROLES:
      return {
        ...state,
        roles: action.payload
      };
    case GET_DASH_PANEL_DATA:
      return {
        ...state,
        panel_data: action.payload
      };
    default:
      return state;
  }
}
