import React, { useState, useEffect } from 'react';
import calculateDistance from "../functions/calculateDistance";
import ViableSupplier from './ViableSupplier';

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
      <h4 style={{ display: 'inline-block' }}>Suppliers:  </h4>
      <table style={{ width: '100%' }}>
        <thead>
          <tr>
            <th style={{textAlign: 'left'}}>Name:</th>
            <th style={{textAlign: 'left'}}>Postcode:</th>
            <th style={{textAlign: 'left'}}>Distance:</th>
          </tr>
        </thead>
        <tbody>
          {distances.map(({ stockist, distance, error }, index) => (
            <ViableSupplier key={stockist._id} index={index} stockist={stockist} distance={distance} error={error} />
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default StockistCard;