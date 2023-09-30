import React from 'react'
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';

/* COULD NOT USE GOOGLE MAP AS WE NEED TO GET MAP API KEY THAT REQUIRES CREDIT CARD DETAILS TO BE INPUT */
/* GMAIL ID THAT IS SUPPOSED TO BE USED FOR GOOGLE MAP API - rtvibration@cambrian.com.sg */

const containerStyle = {
  width: '100%',
  height: '100%'
};

const center = {
  lat: 1.3521,
  lng: 103.8198
};

const imageBounds = {
  north: 1.3784,
  south: 1.3412,
  east: 103.8972,
  west: 103.8263,
};

function MapViewGoogle() {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: "AIzaSyB41DRUbKWJHPxaFjMAwdrzWzbVKartNGg"
  })

  const [map, setMap] = React.useState(null)

  const onLoad = React.useCallback(function callback(map) {
    const bounds = new window.google.maps.LatLngBounds(center);
    map.fitBounds(bounds);
    /*const historicalOverlay = new window.google.maps.GroundOverlay(
        "samplemap.jpg",
        imageBounds
    );
    historicalOverlay.setMap(map);*/

    setMap(map)
  }, [])

  const onUnmount = React.useCallback(function callback(map) {
    setMap(null)
  }, [])

  return isLoaded ? (
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={13}
        onLoad={onLoad}
        onUnmount={onUnmount}
      >
        { /* Child components, such as markers, info windows, etc. */ }
        <></>
      </GoogleMap>
  ) : <></>
}

export default React.memo(MapViewGoogle)