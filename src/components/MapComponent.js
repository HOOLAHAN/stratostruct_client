import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import { getCoordinatesFromPostcode } from '../functions/getCoordinatesFromPostcode';
import 'mapbox-gl/dist/mapbox-gl.css';

const MapComponent = ({ routeData, sitePostcode, token }) => {
  console.log('MapComponent routeData:', routeData)
  const mapContainer = useRef(null);
  mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_API_KEY;

  useEffect(() => {
    const initializeMap = async () => {
      let centerCoordinates;
      let bounds;

      if (!routeData || !routeData.coordinates) {
        // Ensure sitePostcode is not empty before calling getCoordinatesFromPostcode
        if (sitePostcode) {
          centerCoordinates = await getCoordinatesFromPostcode(sitePostcode, token);
        } else {
          // Handle the scenario where sitePostcode is not available
          console.error('Site postcode is missing.');
          return; // Exit the function if no postcode is provided
        }
      } else {
        bounds = new mapboxgl.LngLatBounds();
        routeData.coordinates.forEach(coord => bounds.extend(coord));
      }

      const map = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v11',
        center: centerCoordinates || [-0.1276, 51.5072], // Default center if no coordinates available
        zoom: 10
      });

      map.on('load', () => {
        if (bounds) {
          map.fitBounds(bounds, { padding: 20 });
        }

        if (routeData && routeData.coordinates) {
          const geojsonData = {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'LineString',
              coordinates: routeData.coordinates
            }
          };

          if (map.getSource('route')) {
            map.getSource('route').setData(geojsonData);
          } else {
            map.addSource('route', {
              type: 'geojson',
              data: geojsonData
            });

            map.addLayer({
              id: 'route',
              type: 'line',
              source: 'route',
              layout: {
                'line-join': 'round',
                'line-cap': 'round'
              },
              paint: {
                'line-color': '#888',
                'line-width': 6
              }
            });
          }
        }
      });

      return () => map.remove();
    };

    initializeMap();
  }, [sitePostcode, routeData, token]);




  return <div ref={mapContainer} style={{ height: '400px', width: '100%' }} />;
};

export default MapComponent;
