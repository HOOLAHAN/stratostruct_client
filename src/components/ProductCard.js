import React from 'react';
import { Button, Text, Box } from '@chakra-ui/react';

const ProductCard = ({ product, cart, onAddToCart, onRemoveFromCart }) => {
  const isInCart = cart.find((item) => item._id === product._id);

  const handleClick = () => {
    if (isInCart) {
      onRemoveFromCart(product);
    } else {
      onAddToCart(product);
    }
  };

  return (
    <Button
      onClick={handleClick}
      bg={isInCart ? '#DEFFF2' : 'transparent'}
      _hover={{ bg: isInCart ? '#bdf3e5' : 'gray.100' }}
      width="full"
      justifyContent="flex-start"
      borderRadius="md"
      boxShadow="md"
    >
      <Box p="4">
        <Text fontWeight="bold" display="inline-block" ml="2">
          {product.component_name}
        </Text>
      </Box>
    </Button>
  );
};

export default ProductCard;
