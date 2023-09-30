import { SENSOR_TABLE_DATA } from "../actions/types";

const initialState = { sensor_table_data: null };

export default function sensorreducer (state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case SENSOR_TABLE_DATA:
      return { sensor_table_data: payload };

    default:
      return state;
  }
}