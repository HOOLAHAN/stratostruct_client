import { apiUrl } from './apiClient';

export async function calculateDistance(postcode1, postcode2, token) {
    const url = apiUrl(`/api/mapbox/getDistance?postcode1=${encodeURIComponent(postcode1)}&postcode2=${encodeURIComponent(postcode2)}`);

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

    // Check if the response contains the 'distance' property
    if (typeof data.distance === 'undefined') {
        throw new Error('Invalid response structure');
    }

    const distanceInKilometers = data.distance;
    return `${distanceInKilometers} km`;
}

export default calculateDistance;
