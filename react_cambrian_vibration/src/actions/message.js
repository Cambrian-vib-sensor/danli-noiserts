import { SET_MESSAGE, CLEAR_MESSAGE } from "./types";
import { logout }  from './auth';

export const setMessage = (message) => (dispatch) => {
  if (message === "Unauthorized!") {
    dispatch(logout());
  }

  dispatch({
    type: SET_MESSAGE,
    payload: message,
  });
}

/*export const setMessage = (message) => ({
  type: SET_MESSAGE,
  payload: message,
});*/

export const clearMessage = () => ({
  type: CLEAR_MESSAGE,
});