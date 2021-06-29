import {
  GET_SECURITY_KEY,
  ACCESS_VALIDITY,
  ERROR_401,
  ERROR_408,
  ERROR_400,
  GET_PAYROLL_PAYSLIP
} from "../actions/types";

const initialState = {
  access: false,
  payslip_id: null,
  payslip_type: null,
  payslip: null,
  ERROR_401: null,
  ERROR_408: null,
  ERROR_400: null
};

export default function(state = initialState, action) {
  switch (action.type) {
    case ACCESS_VALIDITY:
      return {
        ...state,
        access: action.payload.validity,
        payslip_id: action.payload.payslip_id,
        payslip_type: action.payload.payslip_type
      };
    case GET_PAYROLL_PAYSLIP:
      return {
        ...state,
        access: true,
        payslip_id: action.payload.id,
        payslip_type: action.payload.payslip_type
      };

    // case ERROR_401:
    //   return {
    //     ...state,
    //     security_key: null,
    //     ERROR_401: true,
    //     ERROR_408: null,
    //     ERROR_400: null
    //   };
    // case ERROR_408:
    //   return {
    //     ...state,
    //     security_key: null,
    //     ERROR_408: true,
    //     ERROR_401: null,
    //     ERROR_400: null
    //   };
    // case ERROR_400:
    //   return {
    //     ...state,
    //     security_key: null,
    //     ERROR_400: true,
    //     ERROR_401: null,
    //     ERROR_408: null
    //   };
    default:
      return state;
  }
}
