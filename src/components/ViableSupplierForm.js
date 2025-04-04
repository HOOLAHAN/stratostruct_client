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
  HStack,
  InputGroup,
  InputRightElement,
  useToast
} from '@chakra-ui/react';

const ViableSupplierForm = ({ sitePostcode, setSitePostcode, setRouteData, products }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { user } = useAuthContext();
  const [searching, setSearching] = useState(false);
  const [isNewSearch, setIsNewSearch] = useState(true);
  const [hasValidPostcode, setHasValidPostcode] = useState(false);
  const [cart, setCart] = useState([]);
  const [error, setError] = useState('');
  const [hasResults, setHasResults] = useState(false);
  const { isOpen: isModalOpen, onOpen: onModalOpen, onClose: onModalClose } = useDisclosure();
  const toast = useToast();

  const handleModalClose = () => {
    onModalClose();
  };
  
  const handleShowSuppliers = () => {
    onModalOpen()
  };
  
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
  
    if (!user) {
      toast({
        title: 'Access Denied',
        description: 'You must be logged in to search for suppliers.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
  
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
    setHasResults(true);
  }; 

  const handleNewSearch = () => {
    updateIsNewSearch(true);
    setSearching(false);
    setError(null);
    setCart([]);
    setRouteData(null);
    setHasResults(false);
    onClose();
    onModalClose();
  };
  

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
          <HStack spacing={2}>
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
                  isDisabled={!user}
                >
                  Go
                </Button>
              </InputRightElement>
            </InputGroup>
          </HStack>
          <HStack spacing={2} justify="center">
            {hasResults && (
              <>
                <Button
                  size="sm"
                  colorScheme="blue"
                  onClick={handleShowSuppliers}
                >
                  Suppliers List
                </Button>
                <Button
                  size="sm"
                  colorScheme="red"
                  onClick={handleNewSearch}
                >
                  Clear Results
                </Button>
              </>
            )}
          </HStack>
          <FormErrorMessage p={2} bg="white" borderRadius="md">{error}</FormErrorMessage>
        </FormControl>
      </Center>
      {/* Step 2 - Product Selection */}
      <ProductSelectionDrawer
        isOpen={isOpen}
        onClose={onClose}
        products={products}
        cart={cart}
        handleProductClick={handleProductClick}
        handleSubmit={handleSubmit}
        searching={searching}
      />
      <SearchResultsModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        cart={cart}
        sitePostcode={sitePostcode}
        handleShowRoute={handleShowRoute}
        token={user.token}
        handleRouteChange={handleRouteChange}
        handleNewSearch={handleNewSearch}
      />
    </>
  );
};

export default ViableSupplierForm;
