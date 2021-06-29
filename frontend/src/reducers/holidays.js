import { GET_HOLIDAY_DATA } from "../actions/types";

const initialState = {
  holidaydata: null
};

export default function(state = initialState, action) {
  switch (action.type) {
    case GET_HOLIDAY_DATA:
      return {
        ...state,
        holidaydata: action.payload
      };
    default:
      return state;
  }
}
