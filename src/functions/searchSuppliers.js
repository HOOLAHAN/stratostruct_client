import { apiFetch } from './apiClient';

export const searchSuppliers = async ({ sitePostcode, products, token }) => {
  const response = await apiFetch('/api/suppliers/search', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({
      sitePostcode,
      productIds: products.map((product) => product._id),
    }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Failed to search suppliers');
  }

  return data;
};
