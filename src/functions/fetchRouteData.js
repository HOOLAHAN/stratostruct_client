import { apiFetch } from './apiClient';

export const fetchRouteData = async (startPostcode, endPostcode, token) => {

  try {
    const response = await apiFetch('/api/mapbox/getRoute', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ startPostcode, endPostcode }),
    });

    const data = await response.json();
    if (response.ok) {
      return data.routeData;
    } else {
      console.error('Failed to fetch route:', data);
      return null;
    }
  } catch (error) {
    console.error('Error fetching route:', error);
    return null;
  }
};
