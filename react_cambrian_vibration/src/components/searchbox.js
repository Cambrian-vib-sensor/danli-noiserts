import React, { Component, useEffect, useRef, useState } from "react"
import { connect } from "react-redux";
import SLMDataService from "../services/slm.service.js"
//import 'bootstrap/dist/css/bootstrap.min.css'
import { formatDate, getDatesInRange } from "../helpers/helper.js"
import SensorDataTable from "./sensordatatable.js"
import { logout } from "../actions/auth";

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import moment from 'moment'
import AccessAlarmIcon from '@mui/icons-material/AccessAlarm';
import vibrationService from "../services/vibration.service.js";
import { Box } from "@mui/material";
import VibrationDataService from "../services/vibration.service.js";

class SearchList extends Component {
  constructor(props) {
    let today = new Date();
    let nextday = new Date();
    nextday.setDate(nextday.getDate() + 1);
    super(props);
    this.state = {
      sensors: [],
      search_params: {
        sensorid: "",
        fromdate: formatDate(today),
        todate: formatDate(nextday),
      },
      status: "",
      search_result: []
    };

    this.handleSensorChange = this.handleSensorChange.bind(this);
    this.handleFromDateChange = this.handleFromDateChange.bind(this);
    this.handleToDateChange = this.handleToDateChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.retrieveData = this.retrieveData.bind(this);
  }

  componentDidMount() {
    //this.retrieveSensorids();
  }

  componentDidUpdate() {
    //console.log("Component Updated");
    //console.log(this.state.search_params);
  }

  componentWillUnmount() {
    if (this.timeout !== undefined) {
      clearTimeout(this.timeout);
    }
  }

  handleSensorChange(event) {
    var search_params = { ...this.state.search_params };
    search_params.sensorid = event.target.value;
    this.setState({ search_params });
    this.setState({ search_result: [] });
    this.setState({ status: "Sensor changed. Click Search to proceed." });
  }

  handleFromDateChange(event) {
    var search_params = { ...this.state.search_params };
    search_params.fromdate = event.target.value;
    this.setState({ search_params, search_result: [], status: "Start Date changed. Click Search to proceed." });
  }

  handleToDateChange(event) {
    var search_params = { ...this.state.search_params };
    search_params.todate = event.target.value;;
    let todate = new Date(search_params.todate);
    todate.setDate(todate.getDate() + 1);
    search_params.todate = formatDate(todate);
    this.setState({ search_params, search_result: [], status: "End Date changed. Click Search to proceed." });
  }

  retrieveData() {
    var search_params = { 
      fromdate: moment(this.state.search_params.fromdate).subtract(1, 'days').format('yyyy-MM-DD'),
      todate: this.state.search_params.todate,
     };
    this.setState({ status: "Retrieving.." });

    SLMDataService.getsensorbydaterange(search_params).then(response => {
      this.setState({ search_result: response.data });
      this.setState({ status: "Results in mm/s.." });
      //console.log(response.data);
    }).catch(error => {
      console.log(error);
      if (error.response && error.response.data && error.response.data.message === "not_found") {
        this.setState({ status: "No results" });
      }
    });

    let today = new Date();
    //let nextTimeout = ((5 - (new Date().getMinutes())%5) * 60000) + 30000;
    let nextTimeout = ((5 - (today.getMinutes() % 5)) * 60000) - (today.getSeconds() * 1000) + 30000;
    console.log(nextTimeout);

    this.timeout = setTimeout(this.retrieveData, nextTimeout);
  }

  handleSubmit(event) {
    console.log("Retrieve Data called");
    var search_params = { ...this.state.search_params };

    /*if (search_params.sensorid === "") {
      alert("Please choose a sensor");
      return;
    }*/

    if (search_params.fromdate > search_params.todate) {
      alert("Daterange is not proper");
      return;
    }

    if (this.timeout !== undefined) {
      clearTimeout(this.timeout);
    }

    this.retrieveData();
  }

  retrieveSensorids() {
    SLMDataService.getsensoridlist().then(response => {
      this.setState({ sensors: response.data });
      /*if (this.state.sensors) {
        var search_params = {...this.state.search_params};
        search_params.sensorid = this.state.sensors[0].sensorid;
        this.setState({search_params});
      }*/
      //console.log(response.data);
    })
      .catch(e => {
        console.log(e);
      });
  }

  render() {
    const {/*sensors,*/ search_params, search_result, status } = this.state;
    const { userInfo, dispatch } = this.props

    const [dataFormatted, avgDataFormated] = formatData(search_result, search_params)

    if (userInfo.role === "C") {
      return <UserReport userInfo={userInfo} dispatch={dispatch} />
    }
    return (
      <div>
        <div className="row mb-4">
          <div className="col-md-2 form-group">
            <label for="sensorlist">CRY2851 SLM</label><br />
            <label id="sensorlist" style={{ paddingTop: "8px" }}>S.No. 22ACA028</label>
          </div>
          <div className="col-md-3 form-group">
            <label for="fromdate">From:</label>
            <input type="date" id="fromdate" className="form-control" value={search_params.fromdate} onChange={this.handleFromDateChange} name="fromdate"></input>
          </div>
          <div className="col-md-3 form-group">
            <label for="todate">Until:</label>
            <input type="date" id="todate" className="form-control" value={search_params.todate} onChange={this.handleToDateChange} name="todate"></input>
          </div>
          <div className="col-md-3 form-group">
            <br />
            <button type="button" id="search" className="btn btn-secondary" onClick={this.handleSubmit}>Search</button>
          </div>
        </div>
        <div className="row">
          <SensorDataTable avgDataFormated={avgDataFormated} dataFormatted={dataFormatted} status={status} /> {/*sensorid={search_params.sensorid}*/}
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { userInfo } = state.auth;

  return {
    userInfo
  };
}

export default connect(mapStateToProps)(SearchList);


function createData(name, value, disabled) {
  return { name, value, disabled };
}

const rows = [
  createData('Username', "username", true),
  createData('SMS Names', "name"),
  createData('SMS Numbers', "phone_number"),
  createData('Email', "username", true),
  createData('No Reading SMS', "phone_number_no_reading"),
  createData('SMS Name', "name_2"),
  createData('SMS No2', "phone_number_2"),
];


function UserReport({ userInfo, dispatch }) {
  const time = useRef()
  const [userState, setUserState] = useState(userInfo);
  const [searchResult, setSearchResult] = useState([]);
  const [searchParams, setSearchParams] = useState({
    fromdate: moment(),
    todate: moment(),
  });
  const [status, setStatus] = useState("");


  const fetchSensorData = async () => {
    try {
      setStatus("Retrieving..");
      const search_params = { 
        fromdate: moment(searchParams.fromdate).subtract(1, 'days').format('yyyy-MM-DD'),
        todate: moment(searchParams.todate).format('yyyy-MM-DD'),
       };
      const response = await SLMDataService.getsensorbydaterange(search_params)
      if (response.data.length > 0) {
        setSearchResult(response.data)
        setStatus("");
      } else {
        setStatus("No results");
      }
      setInterval(async () => {
        const response = await SLMDataService.getsensorbydaterange(search_params)
        if (response.data.length > 0) {
          setStatus("");
          setSearchResult(response.data)
        }
      }, 1000 * 60 * 5) // 5 minutes
    } catch (error) {
      setStatus("No results");
    }
  }

  useEffect(() => {
    const timer = setInterval(() => {
      time.current.innerHTML = moment(new Date()).format("YYYY-MM-DD HH:mm:ss")
    }, 500)
    fetchClient()
    return () => {
      clearInterval(timer)
    }
  }, [])

  const fetchClient = async () => {
    try {
      const res = await vibrationService.getUserById(userState.id)
      setUserState(res.data)
    } catch (error) {

    }
  }
  const handleUserInfoUpdate = () => {
    const data = {
      username: userState.username,
      name: userState.name,
      phone_number: userState.phone_number,
      name_2: userState.name_2,
      phone_number_2: userState.phone_number_2,
      phone_number_no_reading: userState.phone_number_no_reading,
      telegram: userState.telegram,
    }
    VibrationDataService.updateuserbyuser(userState.id, data)
      .then((response) => {
        fetchClient()
      })
      .catch((error) => {

      });
  }
  const handleUserInfoChange = (fieldName, value) => {
    setUserState(prev => ({
      ...prev,
      [fieldName]: value
    }))
  }

  const signout = () => {
    dispatch(logout());
  };

  const [dataFormatted, avgDataFormated] = formatData(searchResult, searchParams)

  return <div>
    <Box sx={{ marginBottom: "24px" }}>
      <div className="d-flex mb-2 justify-content-between">
        <div  className="d-flex ">
          <AccessAlarmIcon />
          <div className="fw-bold ms-2" ref={time}>{moment(new Date()).format("YYYY-MM-DD HH:mm:ss")}</div>
        </div>
        <Button color="primary" size="small" variant="outlined" onClick={signout}>Logout</Button>
      </div>
      <TableContainer component={Paper}>
        <Table size="small" aria-label="a dense table" border>
          <TableBody>
            {rows.map((row) => (
              <TableRow
                key={row.name}
              >
                <TableCell sx={{ width: '20%', borderRight: "1px solid rgba(224, 224, 224, 1)" }}>
                  {row.name}
                </TableCell>
                <TableCell padding="none" sx={{ width: '60%' }} >
                  <TextField disabled={row.disabled} onChange={(e) => {
                    handleUserInfoChange(row.value, e.target.value)
                  }} fullWidth id="outlined-basic" size="small" value={userState ? userState[row.value] : ""} variant="outlined" />
                </TableCell>
                <TableCell padding="none" sx={{ width: '20%' }} >
                  <Button disabled={row.disabled} onClick={handleUserInfoUpdate} fullWidth color="primary" variant="outlined">Update</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>

    <Box sx={{ marginBottom: "24px" }}>
      <div className="d-flex mb-2">
        Latest Meter Readings (Click on 'S/No' to select meter [Pink Highlight))
      </div>
      <TableContainer component={Paper}>
        <Table size="small" aria-label="a dense table" border>
          <TableHead>
            <TableRow>
              <TableCell sx={{ borderRight: "1px solid rgba(224, 224, 224, 1)", fontWeight: 700 }}>S/No</TableCell>
              <TableCell sx={{ borderRight: "1px solid rgba(224, 224, 224, 1)", fontWeight: 700 }}>Due Date</TableCell>
              <TableCell sx={{ borderRight: "1px solid rgba(224, 224, 224, 1)", fontWeight: 700 }}>Location</TableCell>
              <TableCell sx={{ borderRight: "1px solid rgba(224, 224, 224, 1)", fontWeight: 700 }}>Type</TableCell>
              <TableCell sx={{ borderRight: "1px solid rgba(224, 224, 224, 1)", fontWeight: 700 }}>Date and Time</TableCell>
              <TableCell sx={{ borderRight: "1px solid rgba(224, 224, 224, 1)", fontWeight: 700 }}>Current Leq 5</TableCell>
              <TableCell sx={{ borderRight: "1px solid rgba(224, 224, 224, 1)", fontWeight: 700 }}>Status</TableCell>
              <TableCell sx={{ borderRight: "1px solid rgba(224, 224, 224, 1)", fontWeight: 700 }}>Edit More</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableCell sx={{ borderRight: "1px solid rgba(224, 224, 224, 1)" }}>
              {userState?.sensor?.serial_no}
            </TableCell>
            <TableCell sx={{ borderRight: "1px solid rgba(224, 224, 224, 1)" }}>
              _
            </TableCell>
            <TableCell sx={{ borderRight: "1px solid rgba(224, 224, 224, 1)" }}>
            {userState?.sensor?.location?.name}
            </TableCell>
            <TableCell sx={{ borderRight: "1px solid rgba(224, 224, 224, 1)" }}>
            {userState?.sensor?.location?.location_type}
            </TableCell>
            <TableCell sx={{ borderRight: "1px solid rgba(224, 224, 224, 1)" }}>
              {userState?.sensor?.last_calibration_date ? moment(userState?.sensor?.last_calibration_date).format("LLL") : "-"}
            </TableCell>
            <TableCell sx={{ borderRight: "1px solid rgba(224, 224, 224, 1)" }}>
              _
            </TableCell>
            <TableCell sx={{ borderRight: "1px solid rgba(224, 224, 224, 1)" }}>
              _
            </TableCell>
            <TableCell sx={{ borderRight: "1px solid rgba(224, 224, 224, 1)" }}>
              _
            </TableCell>
          </TableBody>
        </Table>
      </TableContainer>
    </Box>

    <Box sx={{ marginBottom: "24px" }}>
      <div className="d-flex mb-2">
        {/* Latest Meter Readings (Click on 'S/No' to select meter) */}
      </div>
      <TableContainer component={Paper}>
        <Table size="small" aria-label="a dense table" sx={{ fontWeight: 700 }}>
          <TableBody sx={{ fontWeight: 700 }}>
            <TableRow>
              <TableCell sx={{ borderRight: "1px solid rgba(224, 224, 224, 1)", fontWeight: 700 }}>
                Meter Information
              </TableCell>
              <TableCell colSpan={2} sx={{ borderRight: "1px solid rgba(224, 224, 224, 1)", fontWeight: 700 }}>
                {userState?.sensor?.name}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell sx={{ borderRight: "1px solid rgba(224, 224, 224, 1)", fontWeight: 700 }}>
                Weighting
              </TableCell>
              <TableCell colSpan={2} sx={{ borderRight: "1px solid rgba(224, 224, 224, 1)", fontWeight: 700 }}>
                _
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell sx={{ borderRight: "1px solid rgba(224, 224, 224, 1)", fontWeight: 700 }}>
                Response
              </TableCell>
              <TableCell colSpan={2} sx={{ borderRight: "1px solid rgba(224, 224, 224, 1)", fontWeight: 700 }}>
                _
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell sx={{ borderRight: "1px solid rgba(224, 224, 224, 1)", fontWeight: 700 }}>
                Meter Location
              </TableCell>
              <TableCell sx={{ borderRight: "1px solid rgba(224, 224, 224, 1)", fontWeight: 700 }}>
                {userState?.sensor?.location_lat}
              </TableCell>
              <TableCell sx={{ borderRight: "1px solid rgba(224, 224, 224, 1)", fontWeight: 700 }}>
                {userState?.sensor?.location_lng}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell sx={{ borderRight: "1px solid rgba(224, 224, 224, 1)", fontWeight: 700 }}>
                Site Location
              </TableCell>
              <TableCell sx={{ borderRight: "1px solid rgba(224, 224, 224, 1)", fontWeight: 700 }}>
                {userState?.sensor?.location?.name}
              </TableCell>
              <TableCell sx={{ borderRight: "1px solid rgba(224, 224, 224, 1)", fontWeight: 700 }}>
              {userState?.sensor?.location?.location_type}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell sx={{ borderRight: "1px solid rgba(224, 224, 224, 1)", fontWeight: 700 }}>
                Meter Serial No
              </TableCell>
              <TableCell sx={{ borderRight: "1px solid rgba(224, 224, 224, 1)", fontWeight: 700 }}>
                _
              </TableCell>
              <TableCell sx={{ borderRight: "1px solid rgba(224, 224, 224, 1)", fontWeight: 700 }}>
                _
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
    <Box sx={{ backgroundColor: "white", padding: "24px", marginBottom: "24px" }}>
      <div style={{ width: "100%" }} className="d-flex w-full gap-4">
        <DatePicker
          sx={{ width: "100%" }}
          label="Start Date"
          views={['year', 'month', 'day']}
          format="YYYY/MM/DD"
          disableFuture
          value={searchParams.fromdate}
          onChange={(newValue) => {
            setSearchParams(prev => ({
              ...prev,
              fromdate: newValue
            }));
            setSearchResult([])
          }}
        />
        <DatePicker
          sx={{ width: "100%" }}
          fullWidth
          disableFuture
          label="End Date"
          views={['year', 'month', 'day']}
          value={searchParams.todate}
          format="YYYY/MM/DD"
          onChange={(newValue) => {
            setSearchParams(prev => ({
              ...prev,
              todate: newValue
            }));
            setSearchResult([])
          }}
        />
        <Button  onClick={fetchSensorData} size="small" variant="contained" >Search</Button>
      </div>
    </Box>
    <SensorDataTable avgDataFormated={avgDataFormated} dataFormatted={dataFormatted}  status={status} /> {/*sensorid={search_params.sensorid}*/}
  </div>
}

const hours24 = Array.from(Array(24).keys())
const minutes5 = {}
for(let i=0; i<60; i += 5) {
  minutes5[i] = "-"
}
const defaultObject = [{}, {}]

hours24.forEach((hour) => {
  if ( hour >= 0 && hour < 7) {
  defaultObject[0][hour] = minutes5
  } else {
    defaultObject[1][hour] = minutes5
  }
})


const formatData = (data, searchParams) => {
  if (data.length === 0 ) {
    return [{}, {}]
  }
  if (!(searchParams.fromdate || searchParams.todate)) {
    return [{}, {}]
  }
  
  const rangeDate = getDatesInRange(moment(new Date(searchParams.fromdate)).subtract(1, 'days'), searchParams.todate)
  const defaultResult = {}
  const before_date_formatted = moment(new Date(searchParams.fromdate)).subtract(1, 'days').format('yyyy-MM-DD');

  rangeDate.forEach((date) => {
    defaultResult[date] = [JSON.parse(JSON.stringify(defaultObject[1])) , JSON.parse(JSON.stringify(defaultObject[0]))]
  })

    const result = data.reduce((result, current) => {
    const date_processed = new Date(current.received_at)
    
    const date_formatted = moment(new Date(current.received_at)).format('yyyy-MM-DD');
    const before_date_formatted = moment(new Date(current.received_at)).subtract(1, 'days').format('yyyy-MM-DD');
    console.log('date_processed',date_processed, date_formatted, before_date_formatted)
    const hours = date_processed.getHours();
    const minutes = date_processed.getMinutes();
    const minutes_boundary = minutes - (minutes % 5);

      if (result[before_date_formatted]) {
        if (hours >= 0 && hours < 7) {
          result[before_date_formatted][1][hours] = {
            ...result[before_date_formatted][1][hours],
            [minutes_boundary]: current.leq_5min.toFixed(1)
          }
        } else {
          result[date_formatted][0][hours] = {
            ...result[date_formatted][0][hours],
            [minutes_boundary]: current.leq_5min.toFixed(1)
          }
        }
      }
   
    return result
  }, defaultResult)

    const newResult = Object.keys(result).reduce((newResult, date) => {
      const list1 = Object.values(JSON.parse(JSON.stringify(result[date][0]))).slice(0, 12)
      let list2 = Object.values(JSON.parse(JSON.stringify(result[date][0]))).slice(12, 18)
      list2 = list2.concat(Object.values(JSON.parse(JSON.stringify(result[date][1]))))

      let leq1hr_1 = 0
      let leq1hr_2 = 0
      let sumleq1hr_1 = 0
      let sumleq1hr_2 = 0
      let leq12hr_1 = 0
      let leq12hr_2 = 0
      let currDose_1 = 0
      let currDose_2 = 0

      for (let i = 0; i< list1.length; i++) {
        const sumleq5min = Object.values(list1[i]).reduce((sumleq5min, current) => {
          if (current !== '-') {
            sumleq5min += Math.pow(10, Number(current) / 10)
          }
          return sumleq5min
        }, 0)

        leq1hr_1 = parseFloat((10 * Math.log10(sumleq5min / 12)).toFixed(1)) || 0
        sumleq1hr_1 += leq1hr_1
        console.log(sumleq1hr_1);
      }
     
      leq12hr_1 = parseFloat((10 * Math.log10(sumleq1hr_1 / 12)).toFixed(1))
      currDose_1 = 
        parseFloat((Math.pow(10, (leq12hr_1 - 85) / 10) *
        (12.5 * 8) *
        100
      ).toFixed(2));

     list2.forEach(hours => {
        const sumleq5min = Object.values(hours).reduce((sumleq5min, current) => {
          if (current !== '-') {
            sumleq5min += Math.pow(10, current / 10)
          }
          return sumleq5min
        }, 0)
        leq1hr_2 = parseFloat((10 * Math.log10(sumleq5min / 12)).toFixed(1)) || 0
        sumleq1hr_2 += leq1hr_2
      })

      leq12hr_2 = parseFloat((10 * Math.log10(sumleq1hr_2 / 12)).toFixed(1))
      currDose_2 = parseFloat((
        Math.pow(10, (leq12hr_2 - 85) / 10) *
        (12.5 * 8) *
        100
      ).toFixed(2));


      newResult[date] = {
        leq1hr: [leq1hr_1, leq1hr_2],
        leq12hr: [leq12hr_1, leq12hr_2],
        currDose: [currDose_1, currDose_2],
      }
      return newResult
    }, {})
    delete result[before_date_formatted]
  return [result, newResult]
}