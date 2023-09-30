import { SENSOR_TABLE_DATA } from "./types";

export const setSensorTableData = (data) => ({
  type: SENSOR_TABLE_DATA,
  payload: data,
});