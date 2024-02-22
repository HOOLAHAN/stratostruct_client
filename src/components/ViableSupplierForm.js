import { 
  useState
} from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import ProductSelectionDrawer from './ProductSelectionDrawer';
import { isValidPostcode } from '../functions/isValidPostcode';
import { fetchRouteData } from "../functions/fetchRouteData";
import { validateSupplierForm } from '../functions/validateSupplierForm';
import { handleAddToCart } from "../functions/handleAddToCart"
import SearchResultsModal from "./SearchResultsModal";
import {
  Input,
  Button,
  useDisclosure,
  Center,
  FormControl,
  FormErrorMessage,
  InputGroup,
  InputRightElement
} from '@chakra-ui/react';

const ViableSupplierForm = ({ sitePostcode, setSitePostcode, setRouteData, products }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { user } = useAuthContext();
  const [searching, setSearching] = useState(false);
  const [isNewSearch, setIsNewSearch] = useState(true);
  const [hasValidPostcode, setHasValidPostcode] = useState(false);
  const [cart, setCart] = useState([]);
  const [error, setError] = useState('');

  const { isOpen: isModalOpen, onOpen: onModalOpen, onClose: onModalClose } = useDisclosure();

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
    onClose();
    onModalOpen();
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
          <FormErrorMessage p={2} bg="white" borderRadius="md">{error}</FormErrorMessage>
        </FormControl>
      </Center>
      {/* Step 2 - Product Selection */}
      {/* Use the ProductSelectionDrawer component */}
      <ProductSelectionDrawer
        isOpen={isOpen}
        onClose={onClose}
        products={products}
        cart={cart}
        handleProductClick={handleProductClick}
        handleSubmit={handleSubmit}
        searching={searching}
      />
      {/* Use the SearchResultsModal component */}
      <SearchResultsModal
        isOpen={isModalOpen}
        onClose={onModalClose}
        cart={cart}
        sitePostcode={sitePostcode}
        handleShowRoute={handleShowRoute}
        token={user.token}
        handleRouteChange={handleRouteChange}
      />
    </>
  );
};

export default ViableSupplierForm;
