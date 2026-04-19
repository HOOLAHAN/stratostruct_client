import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import { getCoordinatesFromPostcode } from '../functions/getCoordinatesFromPostcode';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Box } from '@chakra-ui/react';

const MapComponent = ({ routeData, sitePostcode, token, searchResults, selectedSupplierId, onSupplierRoute, onSupplierSelect }) => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const markers = useRef([]);

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
    if (!map.current) return;

    markers.current.forEach((marker) => marker.remove());
    markers.current = [];

    if (!token || !searchResults?.site?.coordinates) return;

    const siteMarker = new mapboxgl.Marker({ color: '#1A365D' })
      .setLngLat(searchResults.site.coordinates)
      .setPopup(new mapboxgl.Popup({ offset: 16 }).setText(`Site: ${searchResults.site.postcode}`))
      .addTo(map.current);

    markers.current.push(siteMarker);

    (searchResults.suppliers || []).forEach((supplier) => {
      if (!supplier.coordinates) return;

      const popup = document.createElement('div');
      popup.style.minWidth = '180px';
      popup.innerHTML = `
        <strong>${supplier.name}</strong>
        <div>${supplier.postcode}</div>
        <div>${supplier.distanceKilometers == null ? 'Distance N/A' : `${supplier.distanceKilometers} km`} · ${supplier.durationMinutes == null ? 'Drive N/A' : `${supplier.durationMinutes} min`}</div>
      `;
      const routeButton = document.createElement('button');
      routeButton.type = 'button';
      routeButton.textContent = 'Show route';
      routeButton.style.marginTop = '8px';
      routeButton.style.padding = '6px 10px';
      routeButton.style.border = '0';
      routeButton.style.borderRadius = '4px';
      routeButton.style.background = '#2B6CB0';
      routeButton.style.color = '#fff';
      routeButton.style.cursor = 'pointer';
      routeButton.onclick = () => {
        onSupplierSelect?.(supplier._id);
        onSupplierRoute?.(supplier.postcode);
      };
      popup.appendChild(routeButton);

      const marker = new mapboxgl.Marker({ color: selectedSupplierId === supplier._id ? '#D69E2E' : supplier.matchCount > 1 ? '#2F855A' : '#3182CE' })
        .setLngLat(supplier.coordinates)
        .setPopup(new mapboxgl.Popup({ offset: 16 }).setDOMContent(popup))
        .addTo(map.current);

      marker.getElement().addEventListener('click', () => onSupplierSelect?.(supplier._id));
      markers.current.push(marker);
    });

    const bounds = new mapboxgl.LngLatBounds();
    markers.current.forEach((marker) => bounds.extend(marker.getLngLat()));
    if (markers.current.length > 1) {
      map.current.fitBounds(bounds, { padding: { top: 120, bottom: 80, left: 80, right: 80 }, maxZoom: 10 });
    } else {
      map.current.setCenter(searchResults.site.coordinates);
      map.current.setZoom(10);
    }
  }, [onSupplierRoute, onSupplierSelect, searchResults, selectedSupplierId, token]);

  useEffect(() => {
    const updateMap = async () => {
      // Check if token is available
      if (!token) {
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
