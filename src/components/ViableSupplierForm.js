import { useState } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import StockistCard from './StockistCard';
import { isValidPostcode } from '../functions/isValidPostcode';
import { fetchRouteData } from "../functions/fetchRouteData";
import { validateSupplierForm } from '../functions/validateSupplierForm';
import { handleAddToCart } from "../functions/handleAddToCart"
import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Input,
  Button,
  useDisclosure,
  VStack,
  Text,
  Box,
  Wrap,
  WrapItem,
  Center
} from '@chakra-ui/react';

const ViableSupplierForm = ({ sitePostcode, setSitePostcode, setRouteData, routeData, products }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { user } = useAuthContext();
  const [searching, setSearching] = useState(false);
  const [isNewSearch, setIsNewSearch] = useState(true);
  const [hasValidPostcode, setHasValidPostcode] = useState(false);
  const [cart, setCart] = useState([]);
  const [error, setError] = useState('');

  const handlePostcodeChange = (e) => {
    const newPostcode = e.target.value;
    setSitePostcode(newPostcode);
    updateHasValidPostcode(isValidPostcode(newPostcode));
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (searching) {
      handleNewSearch();
      return;
    }

    const errorMessage = validateSupplierForm(user, cart, sitePostcode, updateHasValidPostcode);
    if (errorMessage) {
      setError(errorMessage);
      return;
    }

    setError('');
    updateHasValidPostcode(true);
    setSearching(true);
  }

  const handleNewSearch = () => {
    updateIsNewSearch(true);
    setSearching(false);
    setError(null);
    setCart([]);
  }

  const updateIsNewSearch = (status) => {
    setIsNewSearch(status);
  };

  const updateHasValidPostcode = (status) => {
    setHasValidPostcode(status);
  };

  const handleShowRoute = async (endPostcode) => {
    const token = user.token;
    // Fetch the route data
    const fetchedRouteData = await fetchRouteData(sitePostcode, endPostcode, token);
    if (fetchedRouteData) {
      setRouteData(fetchedRouteData);
      return fetchedRouteData;
    }
    return null;
  };

  const handleRouteChange = (newRouteData) => {
    if (newRouteData) {
      setRouteData(newRouteData);
      console.log('Route data updated with handleRouteChange');
    } else {
      // TODO: handle the case where newRouteData is null or undefined
    }
  };

  const handleProductClick = (product) => {
    if (!isValidPostcode(sitePostcode)) {
      setError('Please input a valid postcode');
      return;
    }
    setError('');
    if (isNewSearch && hasValidPostcode) {
      if (cart.find((item) => item._id === product._id)) {
        handleRemoveFromCart(product);
      } else {
        onAddToCart(product);
      }
    }
  };

  const productTypes = products
    ? Array.from(new Set(products.map((product) => product.component_type))).reverse()
    : [];

    const onAddToCart = async (product) => {
      await handleAddToCart(product, cart, user, sitePostcode, setCart);
    };
  
    const handleRemoveFromCart = (product) => {
      setCart((prevCart) => prevCart.filter((item) => item._id !== product._id));
    };
  
  return (
    <>
      <Button onClick={onOpen}>Check for suppliers</Button>
      <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="lg">
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Check for suppliers:</DrawerHeader>
          <DrawerBody>
            <VStack spacing={4}>
              {/* Step 1 - Postcode input */}
              <Text fontSize="2xl" fontWeight="bold">Step 1 - Enter your postcode:</Text>
              <Input
                value={sitePostcode}
                onChange={handlePostcodeChange}
                placeholder="e.g. SE10 8XJ"
              />
              {error && (
                <Text color="red.500">{error}</Text>
              )}
              {searching && cart.length > 0 && (
                <Box>
                  <Text>Suppliers:</Text>
                  {cart.map((product, index) => (
                    <StockistCard
                      key={product._id + (routeData ? '_routeLoaded' : '')}
                      product={product}
                      index={index + 1}
                      sitePostcode={sitePostcode}
                      handleShowRoute={handleShowRoute}
                      token={user.token}
                      handleRouteChange={handleRouteChange}
                    />
                  ))}
                </Box>
              )}
              {/* Step 2 - Product Selection */}
              <Text fontSize="2xl" fontWeight="bold">Step 2 - Select products required:</Text>
              {productTypes.map((type) => (
                <Box key={type}>
                  <Center><Text fontSize="xl" mb={2}>{type}:</Text></Center>
                  <Wrap spacing="10px" justify="center">
                    {products.filter(product => product.component_type === type).map(product => (
                      <WrapItem key={product._id}>
                        <Button
                          onClick={() => handleProductClick(product)}
                          colorScheme={cart.find(item => item._id === product._id) ? 'teal' : 'gray'}
                          isDisabled={!isNewSearch}
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
            <Button colorScheme="blue" onClick={handleSubmit}>
              {searching ? 'New Search' : 'Find Suppliers'}
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
};


export default ViableSupplierForm;
