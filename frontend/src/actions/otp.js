import {
  ACCESS_VALIDITY,
  GET_PAYROLL_PAYSLIP,
  ERROR_401,
  ERROR_408,
  ERROR_400
} from "./types";
import axios from "axios";
import { tokenConfig } from "./auth";
import { errorMessage } from "./alerts";
import { createMessage } from "./alerts";

// OTP Validation Check
export const validateOtpCheck = () => (dispatch, getState) => {
  axios
    .get(`accounts/api/validate/`, tokenConfig(getState))
    .then(res => {
      dispatch({
        type: ACCESS_VALIDITY,
        payload: res.data
      });
    })
    .catch(err => {
      if (!err.response) {
        dispatch(
          createMessage("Network Error. Something went wrong!", "error")
        );
      }
    });
};

//Request OTP Code
export const genOtpCode = username => (dispatch, getState) => {
  //REQUEST BODY
  const body = JSON.stringify({ username });
  axios
    .post("accounts/api/otp-order/", body, tokenConfig(getState))
    .then(res => {
      console.log("otp response");
      console.log(res.data);
    })
    .catch(err => {
      if (!err.response) {
        dispatch(
          createMessage("Network Error. Something went wrong!", "error")
        );
      }
    });
};

export const validateOtpCode = body => (dispatch, getState) => {
  //REQUEST BODY

  axios
    .post("accounts/api/validate/", body, tokenConfig(getState))
    .then(res => {
      dispatch(createMessage(res.data.message, res.data.msg_type));
      dispatch(validateOtpCheck());
      dispatch({
        type: GET_PAYROLL_PAYSLIP,
        payload: res.data.payslip
      });
    })
    .catch(err => {
      console.log(err);
      //   if (err.response.status == 401) {
      //     dispatch({
      //       type: ERROR_401
      //     });
      //   }
      //   if (err.response.status == 408) {
      //     dispatch({
      //       type: ERROR_408
      //     });
      //   }
      //   if (err.response.status == 400) {
      //     dispatch({
      //       type: ERROR_400
      //     });
      //   }
    });
};
