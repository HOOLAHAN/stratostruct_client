import React from 'react';
import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Button,
  VStack,
  Text,
  Box,
  Wrap,
  WrapItem,
  Center
} from '@chakra-ui/react';

const ProductSelectionDrawer = ({
  isOpen,
  onClose,
  products,
  cart,
  handleProductClick,
  handleSubmit,
  searching
}) => {
  const productTypes = products
    ? Array.from(new Set(products.map((product) => product.component_type))).reverse()
    : [];

  return (
    <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="lg">
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader bg="blue.500" color="white" minH={48.77}>Select Components:</DrawerHeader>
        <DrawerBody>
          <VStack spacing={4}>
            {productTypes.map((type) => (
              <Box key={type}>
                <Center><Text fontSize="xl" mb={2}>{type}:</Text></Center>
                <Wrap spacing="10px" justify="center">
                  {products.filter(product => product.component_type === type).map(product => (
                    <WrapItem key={product._id}>
                      <Button
                        onClick={() => handleProductClick(product)}
                        colorScheme={cart.find(item => item._id === product._id) ? 'teal' : 'gray'}
                        isDisabled={!isOpen}
                        size="sm"
                      >
                        {product.component_name}
                      </Button>
                    </WrapItem>
                  ))}
                </Wrap>
              </Box>
            ))}
          </VStack>
        </DrawerBody>
        <DrawerFooter>
          <Button variant="outline" mr={3} onClick={onClose}>
            Close
          </Button>
          <Button 
            colorScheme={searching ? 'red' : 'blue'} 
            onClick={handleSubmit}
          >
            {searching ? 'Clear Results' : 'Find Suppliers'}
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default ProductSelectionDrawer;
