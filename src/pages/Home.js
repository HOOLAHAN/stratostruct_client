import { useEffect, useState } from "react";
import { useProductsContext } from "../hooks/useProductsContext";
import { useAuthContext } from '../hooks/useAuthContext';
import ViableSupplierForm from "../components/ViableSupplierForm";
import { fetchProducts } from "../functions/fetchProducts";
import MapComponent from "../components/MapComponent";
import { Box, VStack, Alert, AlertIcon } from '@chakra-ui/react';

const Home = () => {
  const { products, dispatchProducts } = useProductsContext();
  const { user } = useAuthContext();
  const [sitePostcode, setSitePostcode] = useState('');
  const [routeData, setRouteData] = useState(null);

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
      />
      <VStack spacing={4} p={5}>
        {user ? (
          <ViableSupplierForm
            sitePostcode={sitePostcode}
            setSitePostcode={setSitePostcode}
            products={products}
            setRouteData={setRouteData}
            routeData={routeData}
          />
        ) : (
          <Alert status="warning" variant="left-accent">
            <AlertIcon />
            Please log in to search for suppliers.
          </Alert>
        )}
      </VStack>
    </Box>
  );
}

export default Home;
