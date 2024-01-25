import React from 'react';
import ViableSupplier from './ViableSupplier';

const StockistCard = ({ product, index, sitePostcode, handleShowRoute, routeData, token, handleRouteChange }) => {
  console.log("Received routeData in StockistCard:", routeData)
  const onShowRoute = (endPostcode) => {
    handleShowRoute(endPostcode).then(newRouteData => {
      handleRouteChange(newRouteData);
    });
  };
  return (
    <div>
      <p><strong>{index}. {product.component_name} ({product.component_type}):</strong></p>
      {product.stockists && product.stockists.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Postcode</th>
              <th>Distance</th>
              <th>Show Route</th>
            </tr>
          </thead>
          <tbody>
            {product.stockists.map((stockist, idx) => (
              <ViableSupplier
                key={stockist._id}
                index={idx + 1}
                stockist={stockist}
                distance={stockist.distance}
                showRouteButton={<button onClick={() => onShowRoute(stockist.postcode)}>Show Route</button>}
              />
            ))}
          </tbody>
        </table>
      ) : <p>No suppliers available</p>}
    </div>
  );
};

export default StockistCard;
