import { SET_MESSAGE, CLEAR_MESSAGE } from "../actions/types";

const initialState = {};

export default function messagereducer (state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case SET_MESSAGE:
      return { notificationMsg: payload };

    case CLEAR_MESSAGE:
      return { notificationMsg: "" };

    default:
      return state;
  }
}