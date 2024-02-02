import { 
  useState
} from "react";
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
  Center,
  FormControl,
  FormErrorMessage,
  InputGroup,
  InputRightElement
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
    setError(''); // Clear error message when user modifies postcode
    setHasValidPostcode(isValidPostcode(newPostcode));
  };

  const validateAndOpenDrawer = () => {
    if (isValidPostcode(sitePostcode)) {
      setError(''); 
      onOpen();
    } else {
      setError('Please enter a valid postcode.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!hasValidPostcode) {
      setError('Please enter a valid postcode.');
      return;
    }

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
    onOpen();
  };

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
      {/* Step 1 - Postcode input */}
      <Center mb="4">
        <FormControl isInvalid={error}>
          <InputGroup>
            <Input
              id="postcode"
              value={sitePostcode}
              onChange={handlePostcodeChange}
              placeholder="Enter Postcode"
              bg="white"
              borderColor={error ? 'red.500' : 'gray.200'}
            />
            <InputRightElement>
              <Button 
              h="100%" 
              size="sm" 
              onClick={validateAndOpenDrawer} 
              colorScheme="blue" 
              mt={5}
              >
                Go
              </Button>
            </InputRightElement>
          </InputGroup>
          <FormErrorMessage bg="white">{error}</FormErrorMessage>
        </FormControl>
      </Center>
      {/* Step 2 - Product Selection */}
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
