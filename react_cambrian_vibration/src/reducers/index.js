import { combineReducers } from "redux";
import auth from "./auth";
import message from "./message";
import sensor from "./sensor";

export default combineReducers({auth, message, sensor});