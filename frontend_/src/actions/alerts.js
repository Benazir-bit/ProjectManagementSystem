import { ALERT_MESSAGE, ERROR_MESSAGE } from "./types";

// ERROR MESSAGE
export const errorMessage = (msg, status, type, position) => {
  return {
    type: ERROR_MESSAGE,
    payload: { msg, status, type, position }
  };
};
// CREATE MESSAGE
export const createMessage = (msg, type) => {
  return {
    type: ALERT_MESSAGE,
    payload: { msg, type }
  };
};
