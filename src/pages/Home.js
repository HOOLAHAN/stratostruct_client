import { useEffect, useState } from "react";
import { useProductsContext } from "../hooks/useProductsContext";
import { useAuthContext } from '../hooks/useAuthContext';
import ViableSupplierForm from "../components/ViableSupplierForm";
import { fetchProducts } from "../functions/fetchProducts";
import MapComponent from "../components/MapComponent";
import LoginModal from "../components/LoginModal";
import SignupModal from "../components/SignupModal";
import {
  Box,
  VStack,
  Button,
  HStack,
  Text,
  Heading,
  useDisclosure,
} from '@chakra-ui/react';

const Home = () => {
  const { products, dispatchProducts } = useProductsContext();
  const { user } = useAuthContext();
  const [sitePostcode, setSitePostcode] = useState('');
  const [routeData, setRouteData] = useState(null);
  const [searchResults, setSearchResults] = useState(null);
  const loginModal = useDisclosure();
  const signupModal = useDisclosure();

  useEffect(() => {
    const initializeProducts = async () => {
      if (user) {
        const fetchedProducts = await fetchProducts(user.token);
        dispatchProducts({ type: 'SET_PRODUCTS', payload: fetchedProducts });
      }
    };
    initializeProducts();
  }, [dispatchProducts, user]);

  return (
    <Box className="home" position="relative">
      <MapComponent
        sitePostcode={sitePostcode}
        token={user ? user.token : ''}
        routeData={routeData}
        searchResults={searchResults}
      />
      <VStack spacing={4} p={5}>
        {user ? (
          <ViableSupplierForm
            sitePostcode={sitePostcode}
            setSitePostcode={setSitePostcode}
            products={products}
            setRouteData={setRouteData}
            routeData={routeData}
            searchResults={searchResults}
            setSearchResults={setSearchResults}
          />
        ) : (
          <Box
            bg="white"
            borderRadius="md"
            boxShadow="0 18px 50px rgba(15, 23, 42, 0.20)"
            borderWidth="1px"
            borderColor="whiteAlpha.700"
            p={{ base: 5, md: 6 }}
            maxW="460px"
            textAlign="center"
          >
            <Heading size="md" color="gray.800" mb={2}>
              Search structural suppliers
            </Heading>
            <Text color="gray.600" mb={5}>
              Log in or create an account to compare nearby suppliers, distances, and routes.
            </Text>
            <HStack spacing={3} justify="center">
              <Button colorScheme="blue" px={8} onClick={loginModal.onOpen}>
                Log In
              </Button>
              <Button variant="outline" colorScheme="blue" px={8} onClick={signupModal.onOpen}>
                Sign Up
              </Button>
            </HStack>
            <LoginModal isOpen={loginModal.isOpen} onClose={loginModal.onClose} />
            <SignupModal isOpen={signupModal.isOpen} onClose={signupModal.onClose} />
          </Box>
        )}
      </VStack>
    </Box>
  );
}

export default Home;
