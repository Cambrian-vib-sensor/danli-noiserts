import * as React from 'react';
import Map, {Marker, Popup} from 'react-map-gl';
import SensorsIcon from '@mui/icons-material/Sensors';
import 'mapbox-gl/dist/mapbox-gl.css';
import VibrationDataService from "../services/vibration.service.js";
import { connect } from "react-redux";
import { setMessage }  from '../actions/message';
import { green } from '@mui/material/colors';

function MapView(props) {
  const mapRef = React.useRef();
  const [mapData, setMapData] = React.useState([]);
  const [timeoutfunc, setTimeoutFunc] = React.useState(null);
  const [isError, setIsError] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isRefetching, setIsRefetching] = React.useState(false);

  const onMapLoad = React.useCallback(() => {
    mapRef.current.on('mousemove', (e) => {
      //console.log(e.lngLat.wrap());
    });
  }, []);

  React.useEffect(() => {
    const fetchData = async () => {
      if (!mapData.length) {
          setIsLoading(true);
      } else {
          setIsRefetching(true);
      }
      try {
        const response =  await VibrationDataService.getsensorvalues();
        const json = response.data;
        /*json.map(item => {
          if (item.location === null) {
            item.location = {};
            item.location.name = null;
            item.location.client = {};
            item.location.client.name = null;
          }
        })*/
        console.log(json);
        setMapData(json);
      } catch (error) {
        setIsError(true);
        console.error(error);
        if (error.response && error.response.data && error.response.data.message) {
          props.dispatch(setMessage(error.response.data.message));
        }
        return;
      }
      setIsError(false);
      setIsLoading(false);
      setIsRefetching(false);

      let today = new Date();
      //let nextTimeout = ((5 - (new Date().getMinutes())%5) * 60000) + 30000;
      let nextTimeout = ((5 - (today.getMinutes()%5)) * 60000) - (today.getSeconds() * 1000) + 30000;
      console.log(nextTimeout);

      let timeout = setTimeout(fetchData, nextTimeout);
      setTimeoutFunc(timeout);
    };
    fetchData();
    return () => {
      if (timeoutfunc !== undefined) {
        console.log("Clearing timeout");
        clearTimeout(timeoutfunc);
      }
    }
  }, []);


  return <Map ref={mapRef} onLoad={onMapLoad}
    initialViewState={{
      longitude: 103.8198,
      latitude: 1.3521,
      zoom: 11
    }}
    style={{width: '100%', height: '100%'}}
    mapStyle="mapbox://styles/mapbox/streets-v9"
    attributionControl={false}
    mapboxAccessToken="pk.eyJ1IjoicnR2aWJyYXRpb24iLCJhIjoiY2w5eHc5OG9vMGV4ZTNycGt5czZhYWdsNCJ9.mi4xIeFeB05Zn7ELGl0Nag"
  >
    {mapData.map((item) => {
        console.log("Mapitem");
        console.log(item.status);
        console.log(item.location_lat);
        if (item.state == 'G' && item.location_lat)
            return (
            <>
            <Marker longitude={item.location_lng} latitude={item.location_lat} anchor="bottom" >
                {/*<img src="../images/lab1.jpg" height="10px" width="10px"/> 1.4921 104 */}
                <SensorsIcon color='green'  fontSize='large'/>
            </Marker>
            {/*<Popup longitude={item.location_lng} latitude={item.location_lat} anchor="top" >
            {item.sensor_value}
            </Popup>*/}
            <Popup longitude={item.location_lng} latitude={item.location_lat} anchor="top" clickOnClose="false">
              {item.client_name + ", " + item.location_name + ", " + item.sensor_value/*.toFixed(3)*/}
            </Popup>
            </>)
        }
    )}
  </Map>;
}

function mapStateToProps(state) {
  return {};
}

export default connect(mapStateToProps)(MapView);