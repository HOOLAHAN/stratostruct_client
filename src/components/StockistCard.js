import React from 'react';
import ViableSupplier from './ViableSupplier';

const StockistCard = ({ product, index, handleShowRoute, routeData, handleRouteChange, sitePostcode}) => {
  const onShowRoute = (endPostcode) => {
    handleShowRoute(endPostcode, sitePostcode).then(newRouteData => {
      if (newRouteData) {
        handleRouteChange(newRouteData);
      } else {
        // TODO: Handle the case where no new route data is returned
        console.log('No route data returned from handleShowRoute');
      }
    }).catch(error => {
      // TODO: Handle any errors that might occur during the fetch
      console.error('Error fetching route data:', error);
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
