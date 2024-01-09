import React from 'react';
import ViableSupplier from './ViableSupplier';

const StockistCard = ({ product, index }) => {
  return (
    <div>
      <p style={{ display: 'inline-block', marginLeft: '5px' }}><strong>{index}. {product.component_name} ({product.component_type}):</strong></p>
      {product.stockists && product.stockists.length > 0 ? (
        <table style={{ width: '100%' }}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Postcode</th>
              <th>Distance</th>
            </tr>
          </thead>
          <tbody>
            {product.stockists.map((stockist, idx) => (
              <ViableSupplier
                key={stockist._id}
                index={idx + 1}
                stockist={stockist}
                distance={stockist.distance}
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
