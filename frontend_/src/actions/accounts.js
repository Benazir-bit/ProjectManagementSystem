import {
  ERROR_MESSAGE,
  PASSWORD_VALIDATION,
  PAYSLIP_GET,
  GET_ALL_GROSS,
  GET_SERVICE,
  GET_PAYROLL_USER,
  CREATE_NEW_SERVICE,
  GET_LOAN,
  GET_EMP_INFO,
  USER_PROVIDENT_FUND,
  GET_MONTHLY_DEDUCTIONS,
  GET_YEAR,
  GET_ALL_PROVIDENT_USER,
  GET_ALL_PROVIDENT_USERS,
  GET_ALL_REQUESTS,
  PROVIDENT_FUND_REQUESTS,
  GET_SAL_DIST,
  GET_REQUESTS,
  GET_ALL_PAYSLIPS,
  GET_ALLSALARY_PAYSLIPS,
  GET_PAYROLL_USER_PROFILE,
  GET_USER_LOANS,
  GET_ALL_LOANS,
  GET_USER_GROSS_HISTORY,
  SUBSCRIBE_USER
} from "./types";
import axios from "axios";
import { tokenConfig } from "./auth";
import { errorMessage } from "./alerts";
import { createMessage } from "./alerts";
import { loading } from "./loading";
import ActionButton from "antd/lib/modal/ActionButton";
import { isObject } from "util";

export const loadPayroll = (id, type) => (dispatch, getState) => {
  axios
    .get(`/accounts/api/payslip/?id=${id}&type=${type}`, tokenConfig(getState))
    .then(res => {
      dispatch({
        type: PAYSLIP_GET,
        payload: res.data
      });
    })
    .catch(err => {
      if (!err.response) {
        dispatch(
          createMessage("Network Error. Something went wrong!", "error")
        );
      } else if (err.response.data.message) {
        dispatch(createMessage(err.response.data.message, "error"));
      } else {
        dispatch(createMessage("something goes wrong!", "error"));
      }
    });
};

export const dispatchloadPayroll = () => (dispatch, getState) => {
  dispatch({
    type: PAYSLIP_GET,
    payload: null
  });
};

export const getGrossSalaryType = (from_month, to_month, group) => (
  dispatch,
  getState
) => {
  // dispatch({
  //   type: GET_ALL_GROSS,
  //   payload: null
  // });
  axios
    .get(
      `/accounts/api/gross/all/?qfrom_month=${from_month}&qto_month=${to_month}&qgroup=${group}`,
      tokenConfig(getState)
    )
    .then(res => {
      dispatch({
        type: GET_ALL_GROSS,
        payload: res.data
      });
    })
    .catch(err => {
      if (!err.response) {
        dispatch(
          createMessage("Network Error. Something went wrong!", "error")
        );
      } else {
        dispatch(
          createMessage(
            `${err.response.status} ${err.response.statusText}`,
            "error"
          )
        );
      }
    });
};
export const getUserGrossSalaryHistory = (id, from, to) => (
  dispatch,
  getState
) => {
  axios
    .get(
      `/accounts/api/salary-history/?userid=${id}&from=${from}&to=${to}`,
      tokenConfig(getState)
    )
    .then(res => {
      dispatch({
        type: GET_USER_GROSS_HISTORY,
        payload: res.data
      });
    })
    .catch(err => {
      if (!err.response) {
        dispatch(
          createMessage("Network Error. Something went wrong!", "error")
        );
      } else {
        dispatch(
          createMessage(
            `${err.response.status} ${err.response.statusText}`,
            "error"
          )
        );
      }
    });
};

export const updateGross = (id, gross) => (dispatch, getState) => {
  dispatch(loading(true));
  const body = {
    id,
    gross
  };
  axios
    .put(`/accounts/api/gross/all/`, body, tokenConfig(getState))
    .then(res => {
      dispatch(loading(false));
      dispatch(createMessage("Gross Salary Updated", "success"));
      dispatch(getGrossSalaryType("", "", "All"));
      // dispatch({
      //   type: GET_ALL_GROSS,
      //   payload: res.data
      // });
    })
    .catch(err => {
      if (!err.response) {
        dispatch(
          createMessage("Network Error. Something went wrong!", "error")
        );
      } else {
        dispatch(
          createMessage(
            `${err.response.status} ${err.response.statusText}`,
            "error"
          )
        );
      }
    });
};
export const getRequests = () => (dispatch, getState) => {
  dispatch({ type: GET_ALL_REQUESTS, payload: null });
  axios
    .get(`/accounts/api/requests/`, tokenConfig(getState))
    .then(res => {
      //console.log("getRequests", res.data);
      dispatch({ type: GET_ALL_REQUESTS, payload: res.data });
    })
    .catch(err => {
      if (!err.response) {
        dispatch(
          createMessage("Network Error. Something went wrong!", "error")
        );
      } else {
        dispatch(
          createMessage(
            `${err.response.status} ${err.response.statusText}`,
            "error"
          )
        );
      }
    });
};

export const getServiceType = (type, filter) => (dispatch, getState) => {
  dispatch({ type: GET_SERVICE, payload: null });
  axios
    .get(`/accounts/api/${type}/services/${filter}/`, tokenConfig(getState))
    .then(res => {
      dispatch({ type: GET_SERVICE, payload: res.data });
    })
    .catch(err => {
      if (!err.response) {
        dispatch(
          createMessage("Network Error. Something went wrong!", "error")
        );
      } else {
        dispatch(
          createMessage(
            `${err.response.status} ${err.response.statusText}`,
            "error"
          )
        );
      }
    });
};
export const getServiceRequest = (type, filter) => (dispatch, getState) => {
  axios
    .get(`/accounts/api/${type}/services/${filter}/`, tokenConfig(getState))
    .then(res => {
      dispatch({ type: GET_REQUESTS, payload: res.data });
    })
    .catch(err => {
      if (!err.response) {
        dispatch(
          createMessage("Network Error. Something went wrong!", "error")
        );
      } else {
        dispatch(
          createMessage(
            `${err.response.status} ${err.response.statusText}`,
            "error"
          )
        );
      }
    });
};
export const getUserByEmpId = username => (dispatch, getState) => {
  axios
    .get(
      `/accounts/api/user-pay/profile/?username=${username}`,
      tokenConfig(getState)
    )
    .then(res => {
      //console.log(res.data, "dataaaaaaaaaaaa");
      dispatch({ type: GET_PAYROLL_USER_PROFILE, payload: res.data });
    })
    .catch(err => {
      if (!err.response) {
        dispatch(
          createMessage("Network Error. Something went wrong!", "error")
        );
      } else {
        dispatch(
          createMessage(
            `${err.response.status} ${err.response.statusText}`,
            "error"
          )
        );
      }
    });
};

export const getUserPayByMonth = (
  username,
  year_start,
  year_end,
  month,
  GrossCall
) => (dispatch, getState) => {
  var api_link;
  if (GrossCall) {
    api_link = `/accounts/api/user-pay/?username=${username}&year_start=${year_start}&year_end=${year_end}&qmonth=${month}&qgross=true`;
  } else {
    api_link = `/accounts/api/user-pay/?username=${username}&year_start=${year_start}&year_end=${year_end}&qmonth=${month}`;
  }

  axios
    .get(api_link, tokenConfig(getState))
    .then(res => {
      dispatch({ type: GET_PAYROLL_USER, payload: res.data });
      if (res.data.message.length != 0) {
        res.data.message.map(msg => {
          dispatch(createMessage(msg, "error"));
        });
      }
    })
    .catch(err => {
      if (!err.response) {
        dispatch(
          createMessage("Network Error. Something went wrong!", "error")
        );
      } else {
        dispatch(
          createMessage(
            `${err.response.status} ${err.response.statusText}`,
            "error"
          )
        );
      }
    });
};
// Create Salary Year
export const createSalaryYear = (type, body) => (dispatch, getState) => {
  dispatch(loading(true));
  axios
    .post(`/accounts/api/${type}/year/`, body, tokenConfig(getState))
    .then(res => {
      dispatch(loading(false));
      dispatch(createMessage("Service Created Salary Year", "success"));
    })
    .catch(err => {
      if (!err.response) {
        dispatch(
          createMessage("Network Error. Something went wrong!", "error")
        );
      } else {
        dispatch(createMessage(err.response.data.message, "error"));
      }
    });
};

// Create New Service
export const addNewService = body => (dispatch, getState) => {
  dispatch(loading(true));
  axios
    .post("/accounts/api/service/", body, tokenConfig(getState))
    .then(res => {
      dispatch(loading(false));
      dispatch(getServiceType("all", "all"));
      dispatch(createMessage("Service Created Successfully", "success"));
    })
    .catch(err => {
      if (!err.response) {
        dispatch(
          createMessage("Network Error. Something went wrong!", "error")
        );
      } else {
        dispatch(
          createMessage(
            `${err.response.status} ${err.response.statusText}`,
            "error"
          )
        );
      }
    });
};

export const UpdateService = body => (dispatch, getState) => {
  axios
    .put("/accounts/api/service/", body, tokenConfig(getState))
    .then(res => {
      dispatch({ type: GET_SERVICE, payload: res.data });
      dispatch(
        createMessage("Service Updated Successfully", "success", "top right")
      );
    })
    .catch(err => {
      if (!err.response) {
        dispatch(
          createMessage("Network Error. Something went wrong!", "error")
        );
      } else {
        dispatch(
          createMessage(
            `${err.response.status} ${err.response.statusText}`,
            "error"
          )
        );
      }
    });
};
export const DeleteService = id => (dispatch, getState) => {
  axios
    .delete(`/accounts/api/service/?id=${id}`, tokenConfig(getState))
    .then(res => {
      dispatch({ type: GET_SERVICE, payload: res.data });
      dispatch(createMessage("Service Deleted Successfully", "success"));
    })
    .catch(err => {
      if (!err.response) {
        dispatch(
          createMessage("Network Error. Something went wrong!", "error")
        );
      } else {
        dispatch(
          errorMessage(
            `${err.response.status} ${err.response.statusText}`,
            "error"
          )
        );
      }
    });
};
export const subcribeNewService = body => (dispatch, getState) => {
  axios
    .post("/accounts/api/subscribe-service/", body, tokenConfig(getState))
    .then(res => {
      dispatch(loading(false));
      dispatch({ type: CREATE_NEW_SERVICE, payload: res.data });
      dispatch(getServiceType("requests", "user"));
      dispatch(createMessage("Service Subscribed Successfully", "success"));
    })
    .catch(err => {
      if (!err.response) {
        dispatch(
          createMessage("Network Error. Something went wrong!", "error")
        );
      } else {
        dispatch(
          createMessage(
            `${err.response.status} ${err.response.statusText}`,
            "error"
          )
        );
      }
    });
};

export const CancelSubscribeRequest = (id, requestFrom) => (
  dispatch,
  getState
) => {
  axios
    .delete(`/accounts/api/subscribe-service/?id=${id}`, tokenConfig(getState))
    .then(res => {
      // dispatch({ type: CREATE_NEW_SERVICE, payload: res.data });

      if (requestFrom == "hr") {
        dispatch(getServiceRequest("requests", "all"));
        dispatch(getRequests());
      }
      if (requestFrom == "user") {
        dispatch(getServiceType("requests", "user"));
      }

      dispatch(createMessage(res.data.message, "success"));
    })
    .catch(err => {
      //console.log(err);
      if (!err.response) {
        dispatch(
          createMessage("Network Error. Something went wrong!", "error")
        );
      } else {
        dispatch(createMessage(err.response.data.message, "error"));
      }
    });
};

export const getEmpId = id => (dispatch, getState) => {
  axios
    .get(`accounts/api/get-user/?emp_id=${id}`, tokenConfig(getState))
    .then(res => {
      dispatch({ type: GET_EMP_INFO, payload: res.data });
    })
    .catch(err => {
      if (!err.response) {
        dispatch(
          createMessage("Network Error. Something went wrong!", "error")
        );
      } else {
        dispatch(
          createMessage(
            `${err.response.status} ${err.response.statusText}`,
            "error"
          )
        );
      }
    });
};

export const userSubscribe = body => (dispatch, getState) => {
  dispatch(loading(true));
  axios
    .post(`/accounts/api/user-service/`, body, tokenConfig(getState))
    .then(res => {
      //console.log(res.data, "userSubscribe");
      dispatch(loading(false));
      dispatch(getServiceTypeUsers());
      if (body.approved) {
        dispatch(getServiceRequest("requests", "all"));
        dispatch(getRequests());
      }
      dispatch(createMessage(res.data.message, "success"));
    })
    .catch(err => {
      //console.log(err);
      if (!err.response) {
        dispatch(
          createMessage("Network Error. Something went wrong!", "error")
        );
      } else {
        if (!err.response.data.message) {
          dispatch(
            createMessage(
              `${err.response.status} ${err.response.statusText}`,
              "error"
            )
          );
        } else {
          dispatch(createMessage(err.response.data.message, "error"));
        }
      }
    });
};

export const getServiceTypeUsers = () => (dispatch, getState) => {
  axios
    .get(`/accounts/api/user-service/`, tokenConfig(getState))
    .then(res => {
      dispatch({ type: SUBSCRIBE_USER, payload: res.data });
    })
    .catch(err => {
      if (!err.response) {
        dispatch(
          createMessage("Network Error. Something went wrong!", "error")
        );
      }
    });
};

export const userUnSubscribe = body => (dispatch, getState) => {
  axios
    .put(`/accounts/api/user-service/`, body, tokenConfig(getState))
    .then(res => {
      dispatch(getServiceType("all", "user"));
      dispatch(createMessage(res.data.message, "success"));
    })
    .catch(err => {
      if (!err.response) {
        dispatch(
          createMessage("Network Error. Something went wrong!", "error")
        );
      } else {
        dispatch(createMessage(err.response.data.message, "error"));
      }
    });
};
// GET ALL Payslips
export const getAllPayslips = (filter, month, year, type, search) => (
  dispatch,
  getState
) => {
  dispatch({
    type: PASSWORD_VALIDATION,
    payload: false
  });
  let api_link;
  if (filter == "group") {
    api_link = `/accounts/api/all-payslips/?qfilter=${filter}&qmonth=${month}&qyear=${year}&qtype=${type}&qgroup=${search}`;
  } else if (filter == "user") {
    api_link = `/accounts/api/all-payslips/?qfilter=${filter}&qmonth=${month}&qyear=${year}&qtype=${type}&quser=${search}`;
  } else {
    api_link = `/accounts/api/all-payslips/?qfilter=${filter}&qmonth=${month}&qyear=${year}&qtype=${type}`;
  }
  axios
    .get(api_link, tokenConfig(getState))
    .then(res => {
      //console.log("resonse", res.data);
      dispatch({
        type: GET_ALL_PAYSLIPS,
        payload: res.data
      });
    })
    .catch(err => {
      if (!err.response) {
        dispatch(
          createMessage("Network Error. Something went wrong!", "error")
        );
      } else {
        dispatch(
          createMessage(
            `${err.response.status} ${err.response.statusText}`,
            "error"
          )
        );
      }
    });
};

export const getAllSalaryPayslips = (filter, month, year) => (
  dispatch,
  getState
) => {
  axios
    .get(
      `/accounts/api/salary-payslips/?qfilter=${filter}&qmonth=${month}&qyear=${year}`,
      tokenConfig(getState)
    )
    .then(res => {
      dispatch({
        type: GET_ALLSALARY_PAYSLIPS,
        payload: res.data
      });
    })
    .catch(err => {
      if (!err.response) {
        dispatch(
          createMessage("Network Error. Something went wrong!", "error")
        );
      } else {
        dispatch(
          createMessage(
            `${err.response.status} ${err.response.statusText}`,
            "error"
          )
        );
      }
    });
};

// GET ANNUAL YEAR

export const getAnnualYearType = type => (dispatch, getState) => {
  axios
    .get(`/accounts/api/${type}/year/`, tokenConfig(getState))
    .then(res => {
      dispatch({
        type: GET_YEAR,
        payload: res.data
      });
    })
    .catch(err => {
      if (!err.response) {
        dispatch(
          createMessage("Network Error. Something went wrong!", "error")
        );
      } else {
        dispatch(
          createMessage(
            `${err.response.status} ${err.response.statusText}`,
            "error"
          )
        );
      }
    });
};

// ASSIGN NEW GROSS SALARY for Employee
export const assignSalary = (year, username, gross) => (dispatch, getState) => {
  dispatch(loading(true));
  const body = {
    username,
    year,
    gross
  };
  axios
    .post(`/accounts/api/gross/all/`, body, tokenConfig(getState))
    .then(res => {
      dispatch(loading(false));
      if (res.status == 206) {
        dispatch(getGrossSalaryType("", "", "All"));
        dispatch(createMessage(res.data.message, "error"));
      } else if (res.status == 201) {
        dispatch(getGrossSalaryType("", "", "All"));
        dispatch(createMessage(res.data.message, "success"));
      }
    })
    .catch(err => {
      if (!err.response) {
        dispatch(
          createMessage("Network Error. Something went wrong!", "error")
        );
      }
    });
};

// PROVIDENT FUND DISPATCHERS
export const getMonthlyDeductions = () => (dispatch, getState) => {
  axios
    .get("/accounts/api/monthly-deduction/", tokenConfig(getState))
    .then(res => {
      dispatch({
        type: GET_MONTHLY_DEDUCTIONS,
        payload: res.data
      });
    })
    .catch(err => {
      if (!err.response) {
        dispatch(
          createMessage("Network Error. Something went wrong!", "error")
        );
      } else {
        dispatch(
          createMessage(
            `${err.response.status} ${err.response.statusText}`,
            "error"
          )
        );
      }
    });
};

export const getProvidentTypeUsers = (type, filter) => (dispatch, getState) => {
  axios
    .get(
      `/accounts/api/provident-service/${type}/${filter}/`,
      tokenConfig(getState)
    )
    .then(res => {
      if (filter == "User") {
        dispatch({
          type: GET_ALL_PROVIDENT_USER,
          payload: res.data
        });
      } else {
        dispatch({
          type: GET_ALL_PROVIDENT_USERS,
          payload: res.data
        });
      }
    })
    .catch(err => {
      if (!err.response) {
        dispatch(
          createMessage("Network Error. Something went wrong!", "error")
        );
      } else {
        dispatch(
          createMessage(
            `${err.response.status} ${err.response.statusText}`,
            "error"
          )
        );
      }
    });
};

export const acceptUsrProvident = (type, filter, body) => (
  dispatch,
  getState
) => {
  axios
    .put(
      `/accounts/api/provident-service/${type}/${filter}/`,
      body,
      tokenConfig(getState)
    )
    .then(res => {
      dispatch(createMessage("Accepted Successfully", "success"));
      dispatch(getRequests());
      dispatch(getUsrProvident("request", "All"));
      // dispatch({ type: USER_PROVIDENT_FUND, payload: res.data });
      dispatch(getProvidentTypeUsers("create", "All"));
    })
    .catch(err => {
      if (!err.response) {
        dispatch(
          createMessage("Network Error. Something went wrong!", "error")
        );
      } else {
        dispatch(
          createMessage(
            `${err.response.status} ${err.response.statusText}`,
            "error"
          )
        );
      }
    });
};
export const declineUsrProvident = (type, filter, id) => (
  dispatch,
  getState
) => {
  axios
    .delete(
      `/accounts/api/provident-service/${type}/${filter}/?id=${id}`,
      tokenConfig(getState)
    )
    .then(res => {
      dispatch(createMessage("Deleted Successfully", "success"));
      dispatch(getRequests());
      dispatch(getUsrProvident("request", "All"));
      // dispatch({ type: USER_PROVIDENT_FUND, payload: res.data });
      // dispatch(getProvidentTypeUsers("create", "All"));
    })
    .catch(err => {
      if (!err.response) {
        dispatch(
          createMessage("Network Error. Something went wrong!", "error")
        );
      } else {
        dispatch(
          createMessage(
            `${err.response.status} ${err.response.statusText}`,
            "error"
          )
        );
      }
    });
};
export const getUsrProvident = (type, filter) => (dispatch, getState) => {
  dispatch({ type: USER_PROVIDENT_FUND, payload: null });
  axios
    .get(
      `/accounts/api/provident-service/${type}/${filter}/`,
      tokenConfig(getState)
    )
    .then(res => {
      if (filter == "User") {
        dispatch({ type: USER_PROVIDENT_FUND, payload: res.data });
      } else {
        dispatch({ type: PROVIDENT_FUND_REQUESTS, payload: res.data });
      }
    })
    .catch(err => {
      if (!err.response) {
        dispatch(
          createMessage("Network Error. Something went wrong!", "error")
        );
      } else {
        dispatch(
          createMessage(
            `${err.response.status} ${err.response.statusText}`,
            "error"
          )
        );
      }
    });
};

export const assignUsrProvident = (type, filter, body) => (
  dispatch,
  getState
) => {
  dispatch(loading(true));
  axios
    .post(
      `/accounts/api/provident-service/${type}/${filter}/`,
      body,
      tokenConfig(getState)
    )
    .then(res => {
      dispatch(loading(false));
      dispatch(getProvidentTypeUsers("create", "All"));
      if (body.requested) {
        dispatch(getUsrProvident("create", "User"));
      }

      dispatch(createMessage(res.data.message, "success"));
    })
    .catch(err => {
      dispatch(loading(false));
      if (!err.response) {
        dispatch(
          createMessage("Network Error. Something went wrong!", "error")
        );
      } else {
        dispatch(
          createMessage("User Already has Provident Fund Subscription", "error")
        );
      }
    });
};

// LOAN PART
export const getLoan = id => (dispatch, getState) => {
  axios
    .get(`/accounts/api/loan-service/?qloan=${id}`, tokenConfig(getState))
    .then(res => {
      dispatch({ type: GET_LOAN, payload: res.data });
    })
    .catch(err => {
      if (!err.response) {
        dispatch(
          createMessage("Network Error. Something went wrong!", "error")
        );
      } else {
        dispatch(
          createMessage(
            `${err.response.status} ${err.response.statusText}`,
            "error"
          )
        );
      }
    });
};
export const getPayableLoans = id => (dispatch, getState) => {
  axios
    .get(`/accounts/api/loan-service/?quser=${id}`, tokenConfig(getState))
    .then(res => {
      dispatch({ type: GET_USER_LOANS, payload: res.data });
    })
    .catch(err => {
      if (!err.response) {
        dispatch(
          createMessage("Network Error. Something went wrong!", "error")
        );
      } else {
        dispatch(
          createMessage(
            `${err.response.status} ${err.response.statusText}`,
            "error"
          )
        );
      }
    });
};

export const getUserLoans = user_type => (dispatch, getState) => {
  axios
    .get(
      `/accounts/api/loan-service/?qtype=loans&quser=${user_type}`,
      tokenConfig(getState)
    )
    .then(res => {
      dispatch({ type: GET_USER_LOANS, payload: res.data });
    })
    .catch(err => {
      if (!err.response) {
        dispatch(
          createMessage("Network Error. Something went wrong!", "error")
        );
      } else {
        dispatch(
          createMessage(
            `${err.response.status} ${err.response.statusText}`,
            "error"
          )
        );
      }
    });
};

export const getAllLoans = user_type => (dispatch, getState) => {
  axios
    .get(
      `/accounts/api/loan-service/?qtype=loans&quser=${user_type}`,
      tokenConfig(getState)
    )
    .then(res => {
      dispatch({ type: GET_ALL_LOANS, payload: res.data });
    })
    .catch(err => {
      if (!err.response) {
        dispatch(
          createMessage("Network Error. Something went wrong!", "error")
        );
      } else {
        dispatch(
          createMessage(
            `${err.response.status} ${err.response.statusText}`,
            "error"
          )
        );
      }
    });
};

export const newLoanRequest = (amount, purpose, needed_by, emi_month) => (
  dispatch,
  getState
) => {
  let body = { amount, purpose, needed_by, emi_month };
  dispatch(loading(true));
  axios
    .post(`/accounts/api/loan-service/`, body, tokenConfig(getState))
    .then(res => {
      dispatch(loading(false));
      dispatch(createMessage(res.data.message, res.data.msg_type));
      dispatch({ type: GET_USER_LOANS, payload: res.data.loan_data });
    })
    .catch(err => {
      if (!err.response) {
        dispatch(
          createMessage("Network Error. Something went wrong!", "error")
        );
      } else {
        dispatch(
          createMessage(
            `${err.response.status} ${err.response.statusText}`,
            "error"
          )
        );
      }
    });
};
export const InIt = () => (dispatch, getState) => {
  dispatch({ type: ERROR_MESSAGE, payload: null });
};

export const updateLoanRequest = body => (dispatch, getState) => {
  axios
    .put(`/accounts/api/loan-service/`, body, tokenConfig(getState))
    .then(res => {
      dispatch(createMessage(res.data.message, res.data.msg_type));
      dispatch({ type: GET_ALL_LOANS, payload: res.data.loan_data });
    })
    .catch(err => {
      //console.log(err.response);
      if (!err.response) {
        dispatch(
          createMessage("Network Error. Something went wrong!", "error")
        );
      } else {
        dispatch(
          createMessage(
            `${err.response.status} ${err.response.statusText}`,
            "error"
          )
        );
      }
    });
};

export const genPaySlip = body => (dispatch, getState) => {
  dispatch(loading(true));
  axios
    .post(`accounts/api/payslip/`, body, tokenConfig(getState))
    .then(res => {
      dispatch(loading(false));
      dispatch(createMessage(res.statusText, "success"));
    })
    .catch(err => {
      if (!err.response) {
        dispatch(
          createMessage("Network Error. Something went wrong!", "error")
        );
      } else {
        dispatch(createMessage(err.response.data.message, "error"));
      }
    });
};

// SALARY DISTRIBUTIONS
export const getDistribution = () => (dispatch, getState) => {
  axios
    .get(`/accounts/api/salary-settings/`, tokenConfig(getState))
    .then(res => {
      dispatch({
        type: GET_SAL_DIST,
        payload: res.data
      });
    })
    .catch(err => {
      if (!err.response) {
        dispatch(
          createMessage("Network Error. Something went wrong!", "error")
        );
      } else {
        dispatch(
          createMessage(
            `${err.response.status} ${err.response.statusText}`,
            "error"
          )
        );
      }
    });
};
export const updateSalDist = body => (dispatch, getState) => {
  axios
    .put(`/accounts/api/salary-settings/`, body, tokenConfig(getState))
    .then(res => {
      dispatch(createMessage("Distribution Updated Successfully", "success"));
    })
    .catch(err => {
      if (!err.response) {
        dispatch(
          createMessage("Network Error. Something went wrong!", "error")
        );
      } else {
        dispatch(
          createMessage(
            `${err.response.status} ${err.response.statusText}`,
            "error"
          )
        );
      }
    });
};
