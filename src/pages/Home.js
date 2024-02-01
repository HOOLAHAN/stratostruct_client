import { useEffect, useState } from "react";
import { useProductsContext } from "../hooks/useProductsContext";
import { useAuthContext } from '../hooks/useAuthContext';
import ViableSupplierForm from "../components/ViableSupplierForm";
import { isValidPostcode } from "../functions/isValidPostcode";
import { fetchProducts } from "../functions/fetchProducts";
import { handleAddToCart } from "../functions/handleAddToCart"
import MapComponent from "../components/MapComponent";
import { Box, VStack, Text, Button } from '@chakra-ui/react';

const Home = () => {
  const { products, dispatchProducts } = useProductsContext();
  const { user } = useAuthContext();
  const [cart, setCart] = useState([]);
  const [isNewSearch, setIsNewSearch] = useState(true);
  const [hasValidPostcode, setHasValidPostcode] = useState(false);
  const [sitePostcode, setSitePostcode] = useState('');
  const [error, setError] = useState('');
  const [routeData, setRouteData] = useState(null);

  const updateIsNewSearch = (status) => {
    setIsNewSearch(status);
  };

  const updateHasValidPostcode = (status) => {
    setHasValidPostcode(status);
  };

  useEffect(() => {
    const initializeProducts = async () => {
      if (user) {
        const fetchedProducts = await fetchProducts(user.token);
        dispatchProducts({ type: 'SET_PRODUCTS', payload: fetchedProducts });
      }
    };
    initializeProducts();
  }, [dispatchProducts, user]);

  const onAddToCart = async (product) => {
    await handleAddToCart(product, cart, user, sitePostcode, setCart);
  };

  const handleRemoveFromCart = (product) => {
    setCart((prevCart) => prevCart.filter((item) => item._id !== product._id));
  };

  const handleNewSearch = () => {
    setIsNewSearch(true);
    setCart([]);
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

  return (
    <Box className="home" position="relative">
      <MapComponent
        sitePostcode={sitePostcode}
        token={user ? user.token : ''}
        routeData={routeData}
      />
      <VStack spacing={4} p={5}>
        <ViableSupplierForm
          cart={cart}
          sitePostcode={sitePostcode}
          setSitePostcode={setSitePostcode}
          products={products}
          onNewSearch={handleNewSearch}
          updateIsNewSearch={updateIsNewSearch}
          updateHasValidPostcode={updateHasValidPostcode}
          error={error}
          setError={setError}
          setRouteData={setRouteData}
          routeData={routeData}
        />
        {error && (
          <Text color="red.500">{error}</Text>
        )}
        <Text fontSize="2xl" fontWeight="bold">Step 2 - Select products required:</Text>
        {productTypes.map((type) => (
          <Box key={type}>
            <Text fontSize="xl" mb={2}>{type}</Text>
            <VStack>
              {products.filter(product => product.component_type === type).map(product => (
                <Button
                  key={product._id}
                  onClick={() => handleProductClick(product)}
                  colorScheme={cart.find(item => item._id === product._id) ? 'teal' : 'gray'}
                  isDisabled={!isNewSearch}
                >
                  {product.component_name}
                </Button>
              ))}
            </VStack>
          </Box>
        ))}
      </VStack>
    </Box>
  );
}

export default Home;
