import React from 'react';
import { Box, Text, Flex, Button, useMediaQuery } from '@chakra-ui/react';

const StockistCard = ({ product, index, handleShowRoute, handleRouteChange, sitePostcode, onClose }) => {
  const [isLargerThanPhone] = useMediaQuery("(min-width: 480px)");

  const onShowRoute = (endPostcode) => {
    handleShowRoute(endPostcode, sitePostcode).then(newRouteData => {
      if (newRouteData) {
        handleRouteChange(newRouteData);
        onClose();
      } else {
        console.log('No route data returned from handleShowRoute');
      }
    }).catch(error => {
      console.error('Error fetching route data:', error);
    });
  };

  return (
    <Box my={4}>
      <Text fontWeight="bold">{index}. {product.component_name} ({product.component_type})</Text>
      {product.stockists && product.stockists.length > 0 ? (
        <Box mt={2}>
          {product.stockists.map((stockist, idx) => (
            <Flex
              key={stockist._id}
              justify="space-between"
              align="center"
              wrap="nowrap"
              my={2}
              p={2}
              borderWidth={1}
              borderRadius="md"
              minH="80px"
            >
              <Box>
                <Text fontWeight="bold">{idx + 1}. {stockist.name}</Text>
                <Text>{stockist.postcode}</Text>
                <Text>{stockist.distance} miles</Text>
              </Box>
              <Button
                size="sm"
                colorScheme="blue"
                onClick={() => onShowRoute(stockist.postcode)}
                mt={isLargerThanPhone ? 0 : 2}
                whiteSpace="nowrap"
              >
                Show Route
              </Button>
            </Flex>
          ))}
        </Box>
      ) : <Text>No suppliers available</Text>}
    </Box>
  );
};

export default StockistCard;
