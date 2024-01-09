export async function calculateDistance(postcode1, postcode2, token) {
    const url = process.env.REACT_APP_BACKEND_API_URL + `/api/mapbox/getDistance?postcode1=${postcode1}&postcode2=${postcode2}`;

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
