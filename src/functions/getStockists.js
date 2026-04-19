import { apiFetch } from './apiClient';

export const getStockists = async (product, user) => {
  try {
    const response = await apiFetch(`/api/suppliers/product/${product._id}`, {
      headers: {
        'Authorization': `Bearer ${user.token}`
      }
    });
    const data = await response.json();
    if (response.ok) {
      return data;
    } else {
      throw new Error(data.error || 'Failed to fetch stockists');
    }
  } catch (error) {
    console.error("Error fetching stockists:", error.message);
    return []; // Return an empty array in case of error
  }
};
