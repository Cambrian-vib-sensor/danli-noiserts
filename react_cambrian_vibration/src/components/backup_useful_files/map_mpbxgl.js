import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax

/*Mapbox account - Username: rtvibration@cambrian.com.sg  Password: Check password stored in Microsoft Edge*/
mapboxgl.accessToken = 'pk.eyJ1IjoicnR2aWJyYXRpb24iLCJhIjoiY2w5eHc5OG9vMGV4ZTNycGt5czZhYWdsNCJ9.mi4xIeFeB05Zn7ELGl0Nag';
 
export default function MapViewGL() {
    const mapContainer = useRef(null);
    const map = useRef(null);
    const [lng, setLng] = useState(103.8198);
    const [lat, setLat] = useState(1.3521);
    const [zoom, setZoom] = useState(11);
 
    useEffect(() => {
        if (map.current) return; // initialize map only once
        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/mapbox/streets-v12',
            center: [lng, lat],
            zoom: zoom
        });
    });
 
    useEffect(() => {
        if (!map.current) return; // wait for map to initialize
        map.current.on('move', () => {
            setLng(map.current.getCenter().lng.toFixed(4));
            setLat(map.current.getCenter().lat.toFixed(4));
            setZoom(map.current.getZoom().toFixed(2));
        });
    });
 
    return (
        <div>
            <div className="map-sidebar">
                Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
            </div>
            <div ref={mapContainer} className="map-container" />
        </div>
    );
}