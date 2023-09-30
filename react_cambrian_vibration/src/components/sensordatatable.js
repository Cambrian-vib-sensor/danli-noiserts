import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

import {
  Box,
  Collapse,
  FormControlLabel,
  Switch,
  TableContainer,
  Table,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import moment from "moment";
export default class SensorDataTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      displayTable: {
        0: true,
      },
    };
  }
 
  handleChange = (checked, i) => {
    const displayTable = {
      ...this.state.displayTable,
      [i]: checked,
    };
    this.setState({ displayTable });
  };

  render() {
    const { dataFormatted, status, avgDataFormated } = this.props;
    const { displayTable } = this.state;

    return (
      <>
        <small class="form-text text-muted">{status}</small>
        {renderTable({
          dataFormatted,
          displayTable,
          handleChange: this.handleChange,
          avgDataFormated,
        })}
      </>
    );
  }
}

const renderTable = ({ dataFormatted, displayTable, handleChange, avgDataFormated }) => {
  if (Object.keys(dataFormatted).length !== 0) {
    return Object.keys(dataFormatted).map((item, indexDate) => {
      const dataTable = dataFormatted[item];
      return (
        <Box
          sx={{
            width: "100%",
            overflow: "auto",
            backgroundColor: "white",
            padding: "24px",
            marginBottom: "12px",
          }}
        >
          <div className="mb-2">
            <div className="fw-bold ms-2">
              <span style={{ width: 100, display: "inline-block" }}>
                Date From:
              </span>{" "}
              {moment(new Date(item)).startOf("D").add(7, 'hours').format("LLL")}
            </div>
            <div className="fw-bold ms-2">
              <span style={{ width: 100, display: "inline-block" }}>
                Date Till:
              </span>{" "}
              {moment(new Date(item)).add(1, 'days').startOf("D").add(7, 'hours').format("LLL")}
            </div>
          </div>
          <FormControlLabel
            control={
              <Switch
                checked={Boolean(displayTable[indexDate])}
                onChange={(e) => handleChange(e.target.checked, indexDate)}
              />
            }
            label="View/Hide table data"
          />
          <Collapse in={Boolean(displayTable[indexDate])} defaultValue={true}>
            <TableContainer>
              <Table className="" style={{ 
                fontWeight: 700
              }} size="small">
                <TableHead>
                  <TableRow>
                    <TableCell
                      sx={{
                        border: "1px solid rgba(224, 224, 224, 1)",
                        fontWeight: 700,
                      }}
                      rowSpan="2"
                    >
                      Day
                    </TableCell>
                    <TableCell
                      sx={{
                        border: "1px solid rgba(224, 224, 224, 1)",
                        fontWeight: 700,
                      }}
                      rowSpan="2"
                    >
                      Time
                    </TableCell>
                    <TableCell
                      sx={{
                        border: "1px solid rgba(224, 224, 224, 1)",
                        fontWeight: 700,
                        textAlign: "center",
                      }}
                      colSpan="12"
                    >
                      LEQ 5 mins
                    </TableCell>
                    <TableCell
                      sx={{
                        border: "1px solid rgba(224, 224, 224, 1)",
                        fontWeight: 700,
                        backgroundColor: "#bbbbff"
                      }}
                      rowSpan="2"
                    >
                      LEQ 1hr
                    </TableCell>
                    <TableCell
                      sx={{
                        border: "1px solid rgba(224, 224, 224, 1)",
                        fontWeight: 700,
                        backgroundColor: "#8787ff"
                      }}
                      rowSpan="2"
                    >
                      LEQ 12hr
                    </TableCell>
                    <TableCell
                      sx={{
                        border: "1px solid rgba(224, 224, 224, 1)",
                        fontWeight: 700,
                        backgroundColor: "#8787ff"
                      }}
                      rowSpan="2"
                    >
                      Curr Dose (%)
                    </TableCell>
                    <TableCell
                      sx={{
                        border: "1px solid rgba(224, 224, 224, 1)",
                        fontWeight: 700,
                        backgroundColor: "#8787ff"
                      }}
                      rowSpan="2"
                    >
                      LEQ5 Max (dB)
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell
                      sx={{
                        border: "1px solid rgba(224, 224, 224, 1)",
                        fontWeight: 700,
                      }}
                    >
                      00
                    </TableCell>
                    <TableCell
                      sx={{
                        border: "1px solid rgba(224, 224, 224, 1)",
                        fontWeight: 700,
                      }}
                    >
                      05
                    </TableCell>
                    <TableCell
                      sx={{
                        border: "1px solid rgba(224, 224, 224, 1)",
                        fontWeight: 700,
                      }}
                    >
                      10
                    </TableCell>
                    <TableCell
                      sx={{
                        border: "1px solid rgba(224, 224, 224, 1)",
                        fontWeight: 700,
                      }}
                    >
                      15
                    </TableCell>
                    <TableCell
                      sx={{
                        border: "1px solid rgba(224, 224, 224, 1)",
                        fontWeight: 700,
                      }}
                    >
                      20
                    </TableCell>
                    <TableCell
                      sx={{
                        border: "1px solid rgba(224, 224, 224, 1)",
                        fontWeight: 700,
                      }}
                    >
                      25
                    </TableCell>
                    <TableCell
                      sx={{
                        border: "1px solid rgba(224, 224, 224, 1)",
                        fontWeight: 700,
                      }}
                    >
                      30
                    </TableCell>
                    <TableCell
                      sx={{
                        border: "1px solid rgba(224, 224, 224, 1)",
                        fontWeight: 700,
                      }}
                    >
                      35
                    </TableCell>
                    <TableCell
                      sx={{
                        border: "1px solid rgba(224, 224, 224, 1)",
                        fontWeight: 700,
                      }}
                    >
                      40
                    </TableCell>
                    <TableCell
                      sx={{
                        border: "1px solid rgba(224, 224, 224, 1)",
                        fontWeight: 700,
                      }}
                    >
                      45
                    </TableCell>
                    <TableCell
                      sx={{
                        border: "1px solid rgba(224, 224, 224, 1)",
                        fontWeight: 700,
                      }}
                    >
                      50
                    </TableCell>
                    <TableCell
                      sx={{
                        border: "1px solid rgba(224, 224, 224, 1)",
                        fontWeight: 700,
                      }}
                    >
                      55
                    </TableCell>
                  </TableRow>
                </TableHead>
                <tbody>
                  {/* [0, 1]  0 => 7ham => 23h pm , 1 => 0h -> 7h am; */} 
                  {dataTable.map((data, indexHours) => {
                    //  *  hour *
                    let leq1hr =  0
               
                    return Object.keys(data).map((value, i) => {
                      let sumleq5min = 0
                      return (
                        <TableRow>
                          { i=== 0 && <TableCell
                               sx={{
                                 border: "1px solid rgba(224, 224, 224, 1)",
                                 fontWeight: 700,
                               }}
                               rowSpan={Object.keys(data).length}
                             >
                              {indexHours === 0 &&  new Date(item).toDateString()}
                              {indexHours === 1 &&  moment(new Date(item)).add(1, 'days').format('LL')}
                             </TableCell>
                          }
                       

                          <TableCell
                            sx={{
                              border: "1px solid rgba(224, 224, 224, 1)",
                              fontWeight: 700,
                            }}
                          >
                            {getHoursDisplay(value)}{indexHours === 1 ? "AM": value < 12 ? "AM" : "PM"}
                          </TableCell>
                          {
                          /* minute */
                            Object.keys(data[value]).map(minute => {
                              sumleq5min += Math.pow(10, data[value][minute] / 10)
                              leq1hr = parseFloat((10 * Math.log10(sumleq5min / 12)).toFixed(1)) || 0

                              return (
                                <TableCell
                                  sx={{
                                    border: "1px solid rgba(224, 224, 224, 1)",
                                    textAlign: "center",
                                    fontWeight: 700
                                  }}
                                >
                                  {data[value][minute]}
                                </TableCell>
                              )
                            })
                          }
                          <TableCell
                            sx={{
                              border: "1px solid rgba(224, 224, 224, 1)",
                              textAlign: "center",
                              backgroundColor: "#bbbbff",
                              fontWeight: 700
                            }}
                          >
                            { leq1hr }
                          </TableCell>

                          { indexHours === 0  && (i === 0 || i === 12 )  && <><TableCell
                            rowSpan={12}
                            sx={{
                              border: "1px solid rgba(224, 224, 224, 1)",
                              textAlign: "center",
                              backgroundColor: "#8787ff",
                              fontWeight: 700
                            }}
                            >
                            {avgDataFormated[item]['leq12hr'][i === 0 ? 0 : 1] || '-'}
                          </TableCell>
                          <TableCell
                            rowSpan={12}
                            sx={{
                              border: "1px solid rgba(224, 224, 224, 1)",
                              textAlign: "center",
                              fontWeight: 700
                            }}
                            >
                            {avgDataFormated[item]['currDose'][i === 0 ? 0 : 1] || '-'}

                          </TableCell>
                          <TableCell
                            rowSpan={12}
                            sx={{
                              border: "1px solid rgba(224, 224, 224, 1)",
                              textAlign: "center",
                              fontWeight: 700
                            }}
                            >EOD
                          </TableCell>
                          </>
                          }
                       
                        </TableRow>
                      )
                    })
                  })}
                <TableRow>
                    <TableCell
                      sx={{
                        border: "1px solid rgba(224, 224, 224, 1)",
                        fontWeight: 700,
                      }}
                      rowSpan="2"
                    >
                      Day
                    </TableCell>
                    <TableCell
                      sx={{
                        border: "1px solid rgba(224, 224, 224, 1)",
                        fontWeight: 700,
                      }}
                      rowSpan="2"
                    >
                      Time
                    </TableCell>
                    <TableCell
                      sx={{
                        border: "1px solid rgba(224, 224, 224, 1)",
                        fontWeight: 700,
                      }}
                    >
                      00
                    </TableCell>
                    <TableCell
                      sx={{
                        border: "1px solid rgba(224, 224, 224, 1)",
                        fontWeight: 700,
                      }}
                    >
                      05
                    </TableCell>
                    <TableCell
                      sx={{
                        border: "1px solid rgba(224, 224, 224, 1)",
                        fontWeight: 700,
                      }}
                    >
                      10
                    </TableCell>
                    <TableCell
                      sx={{
                        border: "1px solid rgba(224, 224, 224, 1)",
                        fontWeight: 700,
                      }}
                    >
                      15
                    </TableCell>
                    <TableCell
                      sx={{
                        border: "1px solid rgba(224, 224, 224, 1)",
                        fontWeight: 700,
                      }}
                    >
                      20
                    </TableCell>
                    <TableCell
                      sx={{
                        border: "1px solid rgba(224, 224, 224, 1)",
                        fontWeight: 700,
                      }}
                    >
                      25
                    </TableCell>
                    <TableCell
                      sx={{
                        border: "1px solid rgba(224, 224, 224, 1)",
                        fontWeight: 700,
                      }}
                    >
                      30
                    </TableCell>
                    <TableCell
                      sx={{
                        border: "1px solid rgba(224, 224, 224, 1)",
                        fontWeight: 700,
                      }}
                    >
                      35
                    </TableCell>
                    <TableCell
                      sx={{
                        border: "1px solid rgba(224, 224, 224, 1)",
                        fontWeight: 700,
                      }}
                    >
                      40
                    </TableCell>
                    <TableCell
                      sx={{
                        border: "1px solid rgba(224, 224, 224, 1)",
                        fontWeight: 700,
                      }}
                    >
                      45
                    </TableCell>
                    <TableCell
                      sx={{
                        border: "1px solid rgba(224, 224, 224, 1)",
                        fontWeight: 700,
                      }}
                    >
                      50
                    </TableCell>
                    <TableCell
                      sx={{
                        border: "1px solid rgba(224, 224, 224, 1)",
                        fontWeight: 700,
                      }}
                    >
                      55
                    </TableCell>
                   
                    <TableCell
                      sx={{
                        border: "1px solid rgba(224, 224, 224, 1)",
                        fontWeight: 700,
                        backgroundColor: "#bbbbff"
                      }}
                      rowSpan="2"
                    >
                      LEQ 1hr
                    </TableCell>
                    <TableCell
                      sx={{
                        border: "1px solid rgba(224, 224, 224, 1)",
                        fontWeight: 700,
                        backgroundColor: "#8787ff"
                      }}
                      rowSpan="2"
                    >
                      LEQ 12hr
                    </TableCell>
                    <TableCell
                      sx={{
                        border: "1px solid rgba(224, 224, 224, 1)",
                        fontWeight: 700,
                        backgroundColor: "#8787ff",
                      }}
                      rowSpan="2"
                    >
                      Curr Dose (%)
                    </TableCell>
                    <TableCell
                      sx={{
                        border: "1px solid rgba(224, 224, 224, 1)",
                        fontWeight: 700,
                        backgroundColor: "#8787ff"
                      }}
                      rowSpan="2"
                    >
                      LEQ5 Max (dB)
                    </TableCell>
                  </TableRow>
                  <TableRow>
                  <TableCell
                      sx={{
                        border: "1px solid rgba(224, 224, 224, 1)",
                        fontWeight: 700,
                        textAlign: "center",
                      }}
                      colSpan="12"
                    >
                      LEQ 5 mins
                    </TableCell>
                  </TableRow>
                </tbody>
              </Table>
            </TableContainer>
          </Collapse>
        </Box>
      );
    });
  }
  return null;
};


function getHoursDisplay (hour) {
  if (hour == 0) {
    return 12
  }
  if (hour < 12) {
    return hour
  }
 
  if (hour % 12 === 0 || hour == 0) {
    console.log(hour)
    return 12
  }

  return hour % 12
}