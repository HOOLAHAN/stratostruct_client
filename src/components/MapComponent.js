import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import { getCoordinatesFromPostcode } from '../functions/getCoordinatesFromPostcode';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Box } from '@chakra-ui/react';

const MapComponent = ({ routeData, sitePostcode, token }) => {
  const mapContainer = useRef(null);
  const map = useRef(null); // Reference to the map instance

  mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_API_KEY;

  // Initialize map only once
  useEffect(() => {
    if (map.current) return;
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [-0.1276, 51.5072], // Default center
      zoom: 10
    });
  }, []);

  // Update map when routeData changes
  useEffect(() => {
    const updateMap = async () => {
      if (!routeData || !routeData.coordinates) {
        if (sitePostcode) {
          const centerCoordinates = await getCoordinatesFromPostcode(sitePostcode, token);
          map.current.setCenter(centerCoordinates);
        }
        return;
      }

      const bounds = new mapboxgl.LngLatBounds();
      routeData.coordinates.forEach(coord => bounds.extend(coord));
      map.current.fitBounds(bounds, { padding: 20 });

      const source = map.current.getSource('route');
      const geojsonData = {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'LineString',
          coordinates: routeData.coordinates
        }
      };

      if (source) {
        source.setData(geojsonData);
      } else {
        map.current.addSource('route', { type: 'geojson', data: geojsonData });
        map.current.addLayer({
          id: 'route',
          type: 'line',
          source: 'route',
          layout: { 'line-join': 'round', 'line-cap': 'round' },
          paint: { 'line-color': '#888', 'line-width': 6 }
        });
      }
    };

    updateMap();
  }, [routeData, sitePostcode, token]);

  return <Box ref={mapContainer} className="mapContainer" w="100vw" h="100vh" position="fixed" top="0" left="0" zIndex="-1" />;

};

export default MapComponent;
