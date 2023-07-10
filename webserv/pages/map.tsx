import React, { useEffect } from 'react';
import mapboxgl from 'mapbox-gl';

mapboxgl.accessToken = 'pk.eyJ1IjoiZGl2ZXJ0enQiLCJhIjoiY2xqeGYybzZuMXVzMzNtbzZ6ZXNqaXNnZSJ9.JAb0ekG5zuG1wkDfkjCuJg'; // Replace with your Mapbox access token

const MapPage = () => {
  useEffect(() => {
    // Create the map instance
    const map = new mapboxgl.Map({
      container: 'map', // HTML element ID where the map will be rendered
      style: 'mapbox://styles/mapbox/streets-v11', // Mapbox style URL
      center: [-74.5, 40], // Initial map center coordinates [longitude, latitude]
      zoom: 9 // Initial map zoom level
    });

    // Add map controls
    map.addControl(new mapboxgl.NavigationControl());

    // Add pinned locations as map markers
    const locations = [
      { name: 'Location 1', coordinates: [-74.5, 40] },
      { name: 'Location 2', coordinates: [-74.6, 40.2] },
      // Add more locations as needed
    ];

    locations.forEach((location) => {
      const marker = new mapboxgl.Marker()
        .setLngLat(location.coordinates)
        .setPopup(new mapboxgl.Popup().setHTML(`<h3>${location.name}</h3>`))
        .addTo(map);
    });

    // Clean up the map instance on component unmount
    return () => map.remove();
  }, []);

  return (
    <div>
      <h1>Map</h1>
      <div id="map" style={{ width: '100%', height: '400px' }}></div>
    </div>
  );
};

export default MapPage;
