import {
  GET_ALL_CONTACTS,
  GET_THREADS,
  GET_THREAD_MESSAGES
} from "../actions/types";

const initialState = {
  contacts: null,
  threads: null,
  messages: null,
  isThreadLoading: true,
  isContactLoading: true,
  isMessageLoading: true
};

export default function(state = initialState, action) {
  switch (action.type) {
    case GET_ALL_CONTACTS:
      return {
        ...state,
        contacts: action.payload,
        isContactLoading: false
      };
    case GET_THREADS:
      return {
        ...state,
        threads: action.payload,
        isThreadLoading: false
      };
    case GET_THREAD_MESSAGES:
      return {
        ...state,
        messages: action.payload,
        isMessageLoading: false
      };

    default:
      return state;
  }
}
