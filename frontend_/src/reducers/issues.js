import { GET_TYPE_ISSUES, GET_ISSUE_DETAIL } from "../actions/types";

const initialState = {
	issues: null,
	issue: null
};

export default function(state = initialState, action) {
	switch (action.type) {
		case GET_ISSUE_DETAIL:
			return {
				...state,
				//issues: null,
				issue: action.payload
			};
		case GET_TYPE_ISSUES:
			return {
				...state,
				issues: action.payload
				//issue: null
			};
		default:
			return state;
	}
}
