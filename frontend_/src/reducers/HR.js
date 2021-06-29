import {
    GET_DESIGNATIONS
} from "../actions/types";

const initialState = {
    designations: null,
};

export default function (state = initialState, action) {
    switch (action.type) {
        case GET_DESIGNATIONS:
            return {
                ...state,
                designations: action.payload
            };
        default:
            return state;
    }
}
