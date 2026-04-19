import { useEffect, useState } from "react";
import { useProductsContext } from "../hooks/useProductsContext";
import { useAuthContext } from "../hooks/useAuthContext";
import { Box, VStack, Heading, SimpleGrid, Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react';
import { apiFetch } from "../functions/apiClient";

// components
import ProductCard from "../components/ProductCard";
import SupplierForm from "../components/SupplierForm";
import ProductForm from "../components/ProductForm";
import SupplierManager from "../components/SupplierManager";

const Admin = () => {
  const { products, dispatchProducts } = useProductsContext();
  const { user } = useAuthContext();
  const [cart, setCart] = useState([]);
  const productTypes = products
    ? Array.from(new Set(products.map((product) => product.component_type)))
    : [];

  useEffect(() => {
    const fetchProducts = async () => {
      const response = await apiFetch("/api/products", {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      const json = await response.json();

      if (response.ok) {
        dispatchProducts({ type: "SET_PRODUCTS", payload: json });
      }
    };
    if (user) {
      fetchProducts();
    }
  }, [dispatchProducts, user]);

  const handleAddToCart = (product) => {
    if (!cart.find((item) => item._id === product._id)) {
      setCart((prevCart) => [...prevCart, product]);
    }
  };

  const handleRemoveFromCart = (product) => {
    setCart((prevCart) => prevCart.filter((item) => item._id !== product._id));
  };

  const clearCart = () => {
    setCart([]);
  };

  return (
    <Box p={5}>
      <Heading size="lg" mb={4}>Admin</Heading>
      <Tabs colorScheme="blue" variant="enclosed">
        <TabList>
          <Tab>Products</Tab>
          <Tab>Suppliers</Tab>
        </TabList>
        <TabPanels>
          <TabPanel px={0}>
            <ProductForm />
            <VStack spacing={8} align="stretch">
              {productTypes.map((type) => (
                <Box key={type}>
                  <Heading size="md" my={4}>{type}</Heading>
                  <SimpleGrid columns={{ sm: 2, md: 3, lg: 4 }} spacing={5}>
                    {products.filter(product => product.component_type === type).map(product => (
                      <ProductCard
                        key={product._id}
                        product={product}
                        onAddToCart={handleAddToCart}
                        onRemoveFromCart={handleRemoveFromCart}
                        cart={cart}
                      />
                    ))}
                  </SimpleGrid>
                </Box>
              ))}
            </VStack>
          </TabPanel>
          <TabPanel px={0}>
            <VStack spacing={6} align="stretch">
              <SupplierForm cart={cart} clearCart={clearCart} />
              <SupplierManager />
            </VStack>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default Admin;
