import React from 'react';
import ViableSupplier from './ViableSupplier';
import { Box, Text, Table, Thead, Tbody, Tr, Th, Button } from '@chakra-ui/react';

const StockistCard = ({ product, index, handleShowRoute, handleRouteChange, sitePostcode }) => {
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
    <Box my={4}>
      <Text fontWeight="bold">{index}. {product.component_name} ({product.component_type})</Text>
      {product.stockists && product.stockists.length > 0 ? (
        <Table variant="simple" size="sm">
          <Thead>
            <Tr>
              <Th>Name</Th>
              <Th>Postcode</Th>
              <Th>Distance</Th>
              <Th>Show Route</Th>
            </Tr>
          </Thead>
          <Tbody>
            {product.stockists.map((stockist, idx) => (
              <ViableSupplier
                key={stockist._id}
                index={idx + 1}
                stockist={stockist}
                distance={stockist.distance}
                showRouteButton={
                  <Button size="sm" colorScheme="blue" onClick={() => onShowRoute(stockist.postcode)}>
                    Show Route
                  </Button>
                }
              />
            ))}
          </Tbody>
        </Table>
      ) : <Text>No suppliers available</Text>}
    </Box>
  );
};

export default StockistCard;
