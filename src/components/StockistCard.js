import React, { useState, useEffect } from 'react';
import calculateDistance from "../functions/calculateDistance";

const StockistCard = ({ item, sitePostcode, updatedCart }) => {
  const [distances, setDistances] = useState([]);


  useEffect(() => {
    async function fetchDistances() {
      const newDistances = [];
      for (const stockistItem of item.stockists) {
        try {
          const distance = await calculateDistance(sitePostcode, stockistItem.postcode);
          newDistances.push({ stockist: stockistItem, distance });
        } catch (error) {
          console.error(error);
          newDistances.push({ stockist: stockistItem, error: error.message });
        }
      }
      setDistances(newDistances);
    }

    fetchDistances();
  }, [item.stockists, sitePostcode, updatedCart]);

  return (
    <div className="product-card">
      <h4 style={{ display: 'inline-block' }}>Component Name: </h4>
      <p style={{ display: 'inline-block', marginLeft: '5px' }}><strong>{item.component_name}</strong></p>
      <br/>
      <h4 style={{ display: 'inline-block' }}>Component Type:  </h4>
      <p style={{ display: 'inline-block', marginLeft: '5px' }}><strong>{item.component_type}</strong></p>
      <br/>
      <h4 style={{ display: 'inline-block' }}>Stockists:  </h4>
      {distances.map(({ stockist, distance, error }) => (
        <p key={stockist._id}><strong>
          {stockist.name} - postcode: {stockist.postcode} - distance: {error ? 'Error' : `${distance}`}
          </strong></p>
      ))}
      <br/>
    </div>
  )
}

export default StockistCard;