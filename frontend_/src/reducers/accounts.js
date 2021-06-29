import {
  PAYSLIP_AUTH,
  PAYSLIP_GET,
  PAYSLIP_AUTH_ERROR,
  PAYSLIP_NOT_GEN,
  GET_ALL_GROSS,
  GET_PAYROLL_USER,
  GET_EMP_INFO,
  GET_SERVICE,
  GET_MONTHLY_DEDUCTIONS,
  SUBSCRIBE_USER,
  GET_YEAR,
  GET_ALL_PROVIDENT_USERS,
  GET_ALL_PROVIDENT_USER,
  GET_SAL_DIST,
  GET_REQUESTS,
  GET_ALL_REQUESTS,
  GET_ALL_PAYSLIPS,
  GET_ALLSALARY_PAYSLIPS,
  USER_PROVIDENT_FUND,
  GET_PAYROLL_USER_PROFILE,
  GET_USER_LOANS,
  GET_ALL_LOANS,
  GET_USERPAYABLE_LOANS,
  GET_LOAN,
  PROVIDENT_FUND_REQUESTS,
  GET_USER_GROSS_HISTORY
} from "../actions/types";

const initialState = {
  payslipContent: null,
  payrollAuth: null,
  payrollNotFound: false,
  gross_all: null,
  payUser: null,
  services: null,
  service_info: null,
  year_period: [],
  all_profund_requests: null,
  provident_users: null,
  provident_user: null,
  distribution: null,
  all_requests: null,
  all_salary_payslips: null,
  all_payslips: null,
  user_profund: null,
  user_monthly_deductions: null,
  total_requests: null,
  user_loans: null,
  all_loans: null,
  user_payable_loans: null,
  loan: null,
  user_gross_history: null
};

export default function(state = initialState, action) {
  switch (action.type) {
    case PAYSLIP_GET:
      return {
        ...state,
        payrollNotFound: false,
        payslipContent: action.payload
      };
    case PAYSLIP_NOT_GEN:
      return {
        ...state,
        payrollNotFound: true
      };
    case GET_LOAN:
      return {
        ...state,
        loan: action.payload
      };
    case PROVIDENT_FUND_REQUESTS: {
      return {
        ...state,
        all_profund_requests: action.payload
      };
    }
    case USER_PROVIDENT_FUND: {
      return {
        ...state,
        user_profund: action.payload
      };
    }

    case GET_ALL_GROSS: {
      return {
        ...state,
        payrollNotFound: false,
        gross_all: action.payload
      };
    }
    case GET_USER_GROSS_HISTORY: {
      return {
        ...state,
        user_gross_history: action.payload
      };
    }
    case GET_PAYROLL_USER: {
      return {
        ...state,
        payrollNotFound: false,
        payUser: action.payload
      };
    }
    case GET_EMP_INFO: {
      return {
        ...state,
        payrollNotFound: false,
        user_info: action.payload
      };
    }
    case GET_SERVICE: {
      return {
        ...state,
        services: action.payload
      };
    }
    case GET_PAYROLL_USER_PROFILE: {
      return {
        ...state,
        payroll_user_profile: action.payload
      };
    }

    case SUBSCRIBE_USER: {
      return {
        ...state,
        service_info: action.payload
      };
    }
    case GET_YEAR: {
      return {
        ...state,
        year_period: action.payload
      };
    }
    case GET_ALL_PROVIDENT_USERS: {
      return {
        ...state,
        provident_users: action.payload
      };
    }
    case GET_ALL_PROVIDENT_USER: {
      return {
        ...state,
        provident_user: action.payload
      };
    }
    case GET_USER_LOANS: {
      return {
        ...state,
        user_loans: action.payload
      };
    }
    case GET_ALL_LOANS: {
      return {
        ...state,
        all_loans: action.payload
      };
    }
    case GET_USERPAYABLE_LOANS: {
      return {
        ...state,
        user_payable_loans: action.payload
      };
    }
    case GET_MONTHLY_DEDUCTIONS: {
      return {
        ...state,
        user_monthly_deductions: action.payload
      };
    }

    case GET_SAL_DIST: {
      return {
        ...state,
        distribution: action.payload
      };
    }
    case GET_REQUESTS: {
      return {
        ...state,
        all_requests: action.payload
      };
    }
    case GET_ALL_REQUESTS: {
      console.log(action.payload, "reducer");
      return {
        ...state,
        total_requests: action.payload
      };
    }
    case GET_ALLSALARY_PAYSLIPS: {
      return {
        ...state,
        all_salary_payslips: action.payload
      };
    }

    case GET_ALL_PAYSLIPS: {
      return {
        ...state,
        all_payslips: action.payload
      };
    }

    default:
      return state;
  }
}
