import { GET_NOTIFICATIONS } from "../actions/types";

const initialState = {
    unread_count: 0,
    notifications: null
};

export default function (state = initialState, action) {
    switch (action.type) {
        case GET_NOTIFICATIONS:
            return {
                ...state,
                unread_count: action.payload.unread_count,
                notifications: action.payload.notifications
            };
        default:
            return state;
    }
}
