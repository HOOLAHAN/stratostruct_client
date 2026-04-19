import { 
  useState
} from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import ProductSelectionDrawer from './ProductSelectionDrawer';
import { isValidPostcode } from '../functions/isValidPostcode';
import { validateSupplierForm } from '../functions/validateSupplierForm';
import { searchSuppliers } from "../functions/searchSuppliers"
import SearchResultsModal from "./SearchResultsModal";
import {
  Input,
  Button,
  useDisclosure,
  Center,
  Box,
  FormControl,
  FormErrorMessage,
  HStack,
  VStack,
  useToast
} from '@chakra-ui/react';

const ViableSupplierForm = ({
  sitePostcode,
  setSitePostcode,
  setRouteData,
  products,
  searchResults,
  setSearchResults,
  selectedSupplierId,
  setSelectedSupplierId,
  handleShowRoute,
  handleLoadSavedSearch,
}) => {
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

    try {
      const results = await searchSuppliers({
        sitePostcode,
        products: cart,
        token: user.token,
      });

      setSearchResults(results);
      setSelectedSupplierId(null);
      onClose();
      onModalOpen();
      setHasResults(true);
    } catch (error) {
      setError(error.message);
      toast({
        title: 'Supplier search failed',
        description: error.message,
        status: 'error',
        duration: 4000,
        isClosable: true,
      });
    } finally {
      setSearching(false);
    }
  }; 

  const handleNewSearch = () => {
    updateIsNewSearch(true);
    setSearching(false);
    setError(null);
    setCart([]);
    setRouteData(null);
    setSearchResults(null);
    setSelectedSupplierId(null);
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

  const handleRouteChange = (newRouteData) => {
    if (newRouteData) {
      setRouteData(newRouteData);
    }
  };

  const loadSavedSearch = (savedSearch) => {
    setCart(savedSearch.cart || []);
    setHasResults(true);
    onModalOpen();
    handleLoadSavedSearch(savedSearch);
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
        setCart((prevCart) => [...prevCart, product]);
      }
    }
  };

  const handleRemoveFromCart = (product) => {
    setCart((prevCart) => prevCart.filter((item) => item._id !== product._id));
  };
  
  return (
    <>
      {/* Step 1 - Postcode input */}
      <Center mb="4">
        <FormControl
          isInvalid={error}
          bg="white"
          borderWidth={1}
          borderColor={error ? 'red.300' : 'blue.100'}
          borderRadius="md"
          boxShadow="0 14px 36px rgba(15, 23, 42, 0.18)"
          p={3}
          maxW={{ base: 'calc(100vw - 32px)', md: '560px' }}
        >
          <VStack spacing={3} align="stretch">
            <Box
              display="grid"
              gridTemplateColumns={{ base: '1fr', sm: 'minmax(240px, 1fr) auto' }}
              gap={2}
              alignItems="start"
            >
              <Input
                id="postcode"
                value={sitePostcode}
                onChange={handlePostcodeChange}
                placeholder="Enter site postcode"
                bg="white"
                color="gray.900"
                borderColor={error ? 'red.400' : 'gray.300'}
                borderWidth={1}
                borderRadius="md"
                h="42px"
                m={0}
                mt={0}
                mb={0}
                minW={0}
                _placeholder={{ color: 'gray.500' }}
                _hover={{ borderColor: 'gray.400' }}
                _focus={{ borderColor: 'blue.500', boxShadow: '0 0 0 1px var(--chakra-colors-blue-500)' }}
              />
              <Button
                h="42px"
                px={6}
                m={0}
                mt={0}
                mb={0}
                alignSelf="start"
                onClick={validateAndOpenDrawer}
                colorScheme="blue"
                isDisabled={!user}
              >
                Search
              </Button>
            </Box>
            {hasResults && (
              <HStack spacing={2} justify="center">
                <Button
                  size="sm"
                  colorScheme="blue"
                  variant="solid"
                  onClick={handleShowSuppliers}
                >
                  Suppliers List
                </Button>
                <Button
                  size="sm"
                  colorScheme="red"
                  variant="outline"
                  bg="white"
                  onClick={handleNewSearch}
                >
                  Clear Results
                </Button>
              </HStack>
            )}
          </VStack>
          <FormErrorMessage mt={2} p={2} bg="red.50" color="red.700" borderRadius="md">{error}</FormErrorMessage>
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
        searchResults={searchResults}
        sitePostcode={sitePostcode}
        handleShowRoute={handleShowRoute}
        handleRouteChange={handleRouteChange}
        handleNewSearch={handleNewSearch}
        selectedSupplierId={selectedSupplierId}
        onSupplierSelect={setSelectedSupplierId}
        onLoadSavedSearch={loadSavedSearch}
      />
    </>
  );
};

export default ViableSupplierForm;
