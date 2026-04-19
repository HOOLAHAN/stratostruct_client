import { apiFetch } from './apiClient';

export const viableSuppliersSearch = async (cartArray, setError, token) => {
  try {
    const response = await apiFetch('/api/suppliers/suppliers-by-products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ productIds: cartArray }) // Use cartArray directly
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const suppliersData = await response.json();

    // Response data mapped back to the products
    const updatedCartArray = cartArray.map(productId => {
      const supplierInfo = suppliersData.find(s => s._id === productId);
      return {
        _id: productId,
        component_name: supplierInfo ? supplierInfo.component_name : '',
        component_type: supplierInfo ? supplierInfo.component_type : '',
        stockists: supplierInfo ? supplierInfo.suppliers : []
      };
    });

    return updatedCartArray;
  } catch (error) {
    setError('Failed to find suppliers: ' + error.message);
    return []; // Return an empty array or handle as needed
  }
}
