import { apiFetch } from './apiClient';

export const fetchProducts = async (userToken) => {
  try {
    const response = await apiFetch('/api/products', {
      headers: {
        'Authorization': `Bearer ${userToken}`
      }
    });
    const json = await response.json();
    if (response.ok) {
      return json;
    } else {
      throw new Error('Failed to fetch products');
    }
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
};
