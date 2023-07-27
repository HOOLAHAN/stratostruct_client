async function calculateDistance(postcode1, postcode2, token) {
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

    const distanceInKilometers = data.distance;
    // const distanceInKilometers = (distanceInMeters / 1000).toFixed(2);
    return `${distanceInKilometers} km`;
}

export default calculateDistance;
