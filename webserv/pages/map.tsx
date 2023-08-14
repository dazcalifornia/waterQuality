import React, { useEffect } from "react";
import mapboxgl from "mapbox-gl";

mapboxgl.accessToken =
  "pk.eyJ1IjoiZGl2ZXJ0enQiLCJhIjoiY2xqeGYybzZuMXVzMzNtbzZ6ZXNqaXNnZSJ9.JAb0ekG5zuG1wkDfkjCuJg"; // Replace with your Mapbox access token

const MapPage = () => {
  useEffect(() => {
    // Create the map instance
    const map = new mapboxgl.Map({
      container: "map", // HTML element ID where the map will be rendered
      style: "mapbox://styles/mapbox/streets-v11", // Mapbox style URL
      center: [101.434391, 9.808507], // Coordinates for the specified location [longitude, latitude]
      zoom: 4, // Initial map zoom level
      attributionControl: false,
    });

    map.on("load", () => {
      // Add an image to use as a custom marker
      map.loadImage(
        "https://docs.mapbox.com/mapbox-gl-js/assets/custom_marker.png",
        (error, image) => {
          if (error) throw error;
          map.addImage("custom-marker", image);
          // Add a GeoJSON source with 2 points
          map.addSource("points", {
            type: "geojson",
            data: {
              type: "FeatureCollection",
              features: [
                {
                  // feature for Mapbox DC
                  type: "Feature",
                  geometry: {
                    type: "Point",
                    coordinates: [100.91998, 13.19247],
                  },
                  properties: {
                    title: "Sriracha",
                  },
                },
                {
                  // feature for Mapbox SF
                  type: "Feature",
                  geometry: {
                    type: "Point",
                    coordinates: [102.318444, 8.0265],
                  },
                  properties: {
                    title: "north bongkot",
                  },
                },
              ],
            },
          });

          // Add a symbol layer
          map.addLayer({
            id: "points",
            type: "symbol",
            source: "points",
            layout: {
              "icon-image": "custom-marker",
              // get the title name from the source's "title" property
              "text-field": ["get", "title"],
              "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
              "text-offset": [0, 1.25],
              "text-anchor": "top",
            },
          });

          // Make the map visible
        }
      );
    });
  }, []);

  return (
    <>
      <div style={{ width: "100%", overflow: "hidden" }}>
        <div
          id="map"
          style={{ width: "100%", height: "40vh", margin: "0 auto" }}
        ></div>
      </div>
      <p>table data</p>
    </>
  );
};

export default MapPage;
