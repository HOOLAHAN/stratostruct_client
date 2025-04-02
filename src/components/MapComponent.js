import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import { getCoordinatesFromPostcode } from '../functions/getCoordinatesFromPostcode';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Box } from '@chakra-ui/react';

const MapComponent = ({ routeData, sitePostcode, token }) => {
  const mapContainer = useRef(null);
  const map = useRef(null);

  mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_API_KEY;

  useEffect(() => {
    if (map.current) return; // Only initialize once
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [-0.1276, 51.5072], // London coordinates
      zoom: 10,
    });
  }, []);

  useEffect(() => {
    const updateMap = async () => {
      // Check if token is available
      if (!token) {
        console.warn("No token available. Clearing map route.");
        // Clear any existing route if the user logs out
        if (map.current.getSource('route')) {
          map.current.removeLayer('route');
          map.current.removeSource('route');
        }
        return;
      }

      try {
        // No valid route data or coordinates
        if (!routeData || !routeData.coordinates || routeData.coordinates.length < 2) {
          if (map.current.getSource('route')) {
            map.current.removeLayer('route');
            map.current.removeSource('route');
          }

          // Set map center if postcode is provided
          if (sitePostcode) {
            const centerCoordinates = await getCoordinatesFromPostcode(sitePostcode, token);
            map.current.setCenter(centerCoordinates);
          }
          return;
        }

        // Adjust map bounds to fit the route
        const bounds = new mapboxgl.LngLatBounds();
        routeData.coordinates.forEach((coord) => bounds.extend(coord));
        map.current.fitBounds(bounds, { padding: { top: 160, bottom: 50, left: 50, right: 50 } });

        const geojsonData = {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: routeData.coordinates,
          },
        };

        // Add or update the route on the map
        if (map.current.getSource('route')) {
          map.current.getSource('route').setData(geojsonData);
        } else {
          map.current.addSource('route', { type: 'geojson', data: geojsonData });
          map.current.addLayer({
            id: 'route',
            type: 'line',
            source: 'route',
            layout: { 'line-join': 'round', 'line-cap': 'round' },
            paint: { 'line-color': '#888', 'line-width': 6 },
          });
        }
      } catch (error) {
        console.error('Error updating map:', error);
      }
    };

    updateMap();
  }, [routeData, sitePostcode, token]);

  return <Box ref={mapContainer} w="100vw" h="100vh" position="fixed" top="0" left="0" zIndex="-1" />;
};

export default MapComponent;
