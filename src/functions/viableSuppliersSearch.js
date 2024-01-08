export const viableSuppliersSearch = async (cartArray, setError, token) => {
  const url = process.env.REACT_APP_BACKEND_API_URL + `/api/suppliers/suppliers-by-products`;

  console.log("Sending Request with product IDs:", cartArray);

  try {
    const response = await fetch(url, {
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

    // Assuming the response data needs to be mapped back to the products
    const updatedCartArray = cartArray.map(productId => {
      const supplierInfo = suppliersData.find(s => s._id === productId);
      return {
        _id: productId,
        stockists: supplierInfo ? supplierInfo.suppliers : []
      };
    });

    return updatedCartArray;
  } catch (error) {
    setError('Failed to find suppliers: ' + error.message);
    return []; // Return an empty array or handle as needed
  }
}
