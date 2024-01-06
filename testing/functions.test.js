import calculateDistance from '../src/functions/calculateDistance';
global.fetch = jest.fn(); // Mocking fetch

// Mocking the environment variable
process.env.REACT_APP_BACKEND_API_URL = 'http://localhost';

beforeEach(() => {
    fetch.mockClear();
});

test('calculateDistance returns distance in kilometers for valid postcodes', async () => {
    fetch.mockResolvedValueOnce({
        json: () => Promise.resolve({ distance: 100 }),
    });

    const distance = await calculateDistance('postcode1', 'postcode2', 'token');
    expect(distance).toBe('100 km');
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(
        'http://localhost/api/mapbox/getDistance?postcode1=postcode1&postcode2=postcode2',
        {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer token',
            }
        }
    );
});

test('calculateDistance throws an error for invalid response', async () => {
  fetch.mockResolvedValueOnce({
      json: () => Promise.resolve({ error: 'Error message' }),
  });

  await expect(calculateDistance('postcode1', 'postcode2', 'token')).rejects.toThrow('Error message');
});