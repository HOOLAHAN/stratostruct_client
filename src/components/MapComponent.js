import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import { getCoordinatesFromPostcode } from '../functions/getCoordinatesFromPostcode';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Box } from '@chakra-ui/react';

const MapComponent = ({ routeData, sitePostcode, token }) => {
  const mapContainer = useRef(null);
  const map = useRef(null); // Reference to the map instance

  mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_API_KEY;

  useEffect(() => {
    if (map.current) return; // Ensure map only initializes once
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [-0.1276, 51.5072],
      zoom: 10
    });
  }, []);

  useEffect(() => {
    const updateMap = async () => {
      if (!routeData || !routeData.coordinates || routeData.coordinates.length < 2) {
        if (map.current.getSource('route')) {
          map.current.removeLayer('route');
          map.current.removeSource('route');
        }
        // Remove existing markers
        document.querySelectorAll('.mapboxgl-marker').forEach(marker => marker.remove());
  
        // Attempt to set center if only sitePostcode is provided
        if (sitePostcode) {
          const centerCoordinates = await getCoordinatesFromPostcode(sitePostcode, token);
          map.current.setCenter(centerCoordinates);
        }
        return;
      }

      const bounds = new mapboxgl.LngLatBounds();
      routeData.coordinates.forEach(coord => bounds.extend(coord));
      map.current.fitBounds(bounds, { padding: 20 });

      // Check and update or set data for 'route'
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

      // Add a green marker for the start of the route
      const startMarkerEl = document.createElement('div');
      startMarkerEl.className = 'marker';
      startMarkerEl.style.backgroundColor = 'green';
      startMarkerEl.style.width = '20px';
      startMarkerEl.style.height = '20px';
      startMarkerEl.style.borderRadius = '50%';

      const startPopup = new mapboxgl.Popup({ offset: 25 }).setText(
        'Site: ' + (sitePostcode || "Unknown")
      );

      new mapboxgl.Marker(startMarkerEl)
        .setLngLat(routeData.coordinates[0])
        .setPopup(startPopup) // sets a popup on this marker
        .addTo(map.current);

      // Add a blue marker for the end of the route
      const endMarkerEl = document.createElement('div');
      endMarkerEl.className = 'marker';
      endMarkerEl.style.backgroundColor = 'blue';
      endMarkerEl.style.width = '20px';
      endMarkerEl.style.height = '20px';
      endMarkerEl.style.borderRadius = '50%';

      const endPopup = new mapboxgl.Popup({ offset: 25 }).setText(
        'Supplier: ' + (routeData.endName || "Unknown")
      );

      new mapboxgl.Marker(endMarkerEl)
        .setLngLat(routeData.coordinates[routeData.coordinates.length - 1])
        .setPopup(endPopup) // sets a popup on this marker
        .addTo(map.current);
    };

    updateMap();

    updateMap();
  }, [routeData, sitePostcode, token]);

  return <Box ref={mapContainer} w="100vw" h="100vh" position="fixed" top="0" left="0" zIndex="-1" />;
};

export default MapComponent;
