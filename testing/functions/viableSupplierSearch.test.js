import { viableSuppliersSearch } from '../../src/functions/viableSuppliersSearch';

// Mock global.fetch
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve([{ _id: '642abaab4444c648472d43cf', suppliers: [{ name: 'Supplier1' }] }]),
  })
);

beforeEach(() => {
  fetch.mockClear();
});

it('fetches suppliers for given product IDs', async () => {
  const cartArray = ['642abaab4444c648472d43cf'];
  const setError = jest.fn();
  const token = 'test-token';

  const result = await viableSuppliersSearch(cartArray, setError, token);

  // Check if fetch was called correctly
  expect(fetch).toHaveBeenCalledTimes(1);
  expect(fetch).toHaveBeenCalledWith(expect.any(String), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ productIds: cartArray })
  });

  // Check if function returns correct data
  expect(result).toEqual([{ _id: '642abaab4444c648472d43cf', stockists: [{ name: 'Supplier1' }] }]);

  // Check if setError was not called
  expect(setError).not.toHaveBeenCalled();
});

it('handles network failure', async () => {
  fetch.mockImplementationOnce(() => Promise.reject(new Error('Network Error')));
  const cartArray = ['642abaab4444c648472d43cf'];
  const setError = jest.fn();
  const token = 'test-token';

  const result = await viableSuppliersSearch(cartArray, setError, token);

  // Check if setError was called with the correct message
  expect(setError).toHaveBeenCalledWith('Failed to find suppliers: Network Error');

  // Check if function returns an empty array on failure
  expect(result).toEqual([]);
});
