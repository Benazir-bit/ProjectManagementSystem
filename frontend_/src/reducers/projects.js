import {
  GET_TYPE_PROJECTS,
  GET_ADMIN_PROJECTS,
  GET_PROJECT_DETAIL,
  GET_GROUP_PROJECTS
} from "../actions/types";

const initialState = {
  projects: null,
  project: null,
  adminprojects: null,
  group_projects: null
};

export default function(state = initialState, action) {
  switch (action.type) {
    case GET_GROUP_PROJECTS:
      return {
        ...state,
        group_projects: action.payload
      };
    case GET_TYPE_PROJECTS:
      return {
        ...state,
        projects: action.payload
      };
    case GET_PROJECT_DETAIL:
      return {
        ...state,
        project: action.payload
      };
    case GET_ADMIN_PROJECTS:
      return {
        ...state,
        adminprojects: action.payload
      };

    default:
      return state;
  }
}
