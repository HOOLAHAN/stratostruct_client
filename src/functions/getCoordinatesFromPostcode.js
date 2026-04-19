import { apiUrl } from './apiClient';

export async function getCoordinatesFromPostcode(sitePostcode, token) {
  const url = apiUrl(`/api/mapbox/getCoordinates?postcode=${encodeURIComponent(sitePostcode)}`);
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    }
  });

  const data = await response.json();
  if (data.error) {
    throw new Error(data.error);
  }

  // Check if the response contains the 'coordinates' property
  if (typeof data.coordinates === 'undefined') {
    throw new Error('Invalid response structure');
  }

  return data.coordinates;
}
