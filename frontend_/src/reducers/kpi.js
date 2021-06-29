import { GET_EMPLOYEE_YEAR_KPI, GET_KPI_DETAILS } from "../actions/types";

const initialState = {
  kpis: null,
  kpi: null
};

export default function(state = initialState, action) {
  switch (action.type) {
    case GET_EMPLOYEE_YEAR_KPI:
      return {
        ...state,
        kpis: action.payload
      };
    case GET_KPI_DETAILS:
      return {
        ...state,
        kpi: action.payload
      };
    default:
      return state;
  }
}
