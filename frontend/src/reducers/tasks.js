import { GET_TYPE_TASKS, GET_TASK_DETAIL } from "../actions/types";

const initialState = {
  tasks: null,
  task: null
};

export default function(state = initialState, action) {
  switch (action.type) {
    case GET_TYPE_TASKS:
      return {
        ...state,
        tasks: action.payload
      };
    case GET_TASK_DETAIL:
      return {
        ...state,
        task: action.payload
      };
    default:
      return state;
  }
}
