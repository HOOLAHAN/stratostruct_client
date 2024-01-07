import React, { useState, useEffect } from 'react';
import calculateDistance from "../functions/calculateDistance";
import ViableSupplier from './ViableSupplier';

const StockistCard = ({ item, sitePostcode, updatedCart, token, index}) => {
  const [distances, setDistances] = useState([]);

  useEffect(() => {
    async function fetchDistances() {
      const newDistances = [];
      for (const stockistItem of item.stockists) {
        try {
          const distance = await calculateDistance(sitePostcode, stockistItem.postcode, token);
          newDistances.push({ stockist: stockistItem, distance });
        } catch (error) {
          console.error(error);
          newDistances.push({ stockist: stockistItem, error: error.message });
        }
      }
      setDistances(newDistances);
    }
    
    fetchDistances();
  }, [item.stockists, sitePostcode, updatedCart, token ]);

  // Sort the distances array based on the distance property
  distances.sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));

  return (
    <div>
      <p style={{ display: 'inline-block', marginLeft: '5px' }}><strong>{index}. {item.component_name} ({item.component_type}):</strong></p>
    {distances.length > 0 ? (
      <table style={{ width: '100%' }}>
      <thead>
        <tr>
          <th style={{ textAlign: 'left', margin: '0', padding: '0', fontWeight: 'normal', fontSize: '16px' }}>Name:</th>
          <th style={{ textAlign: 'left', margin: '0', padding: '0', fontWeight: 'normal', fontSize: '16px' }}>Postcode:</th>
          <th style={{ textAlign: 'left', margin: '0', padding: '0', fontWeight: 'normal', fontSize: '16px' }}>Distance:</th>
        </tr>
      </thead>
      <tbody>
        {distances.map(({ stockist, distance, error }, index) => (
          <ViableSupplier 
            key={stockist._id} 
            index={index} 
            stockist={stockist} 
            distance={distance} 
            error={error} 
          />
        ))}
      </tbody>
      </table>
    ) : (
      <p>No suppliers available</p>
      )}
  </div>
  )
}

export default StockistCard;
