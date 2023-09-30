import { LOGIN_SUCCESS, LOGIN_FAIL, LOGOUT } from "../actions/types";

const userInfo = JSON.parse(localStorage.getItem("userInfo"));

const initialState = userInfo ? { isLoggedIn: true, userInfo, message:null } : { isLoggedIn: false, userInfo: null, message:null};

export default function authreducer (state = initialState, action) {
    const { type, payload } = action;
    switch (type) {
        case LOGIN_SUCCESS:
            return { ...state, isLoggedIn: true, userInfo: payload.userInfo, message: null};
        case LOGIN_FAIL:
            return { ...state, isLoggedIn: false, userInfo: null, message: payload.errorMessage};
        case LOGOUT:
            return { ...state, isLoggedIn: false, userInfo: null, message: null};
        default:
            return state;
    }
}