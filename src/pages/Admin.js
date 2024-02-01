import { useEffect, useState } from "react";
import { useProductsContext } from "../hooks/useProductsContext";
import { useAuthContext } from "../hooks/useAuthContext";
import { Box, VStack, Heading, SimpleGrid } from '@chakra-ui/react';

// components
import ProductCard from "../components/ProductCard";
import SupplierForm from "../components/SupplierForm";
import ProductForm from "../components/ProductForm";

const Admin = () => {
  const { products, dispatchProducts } = useProductsContext();
  const { user } = useAuthContext();
  const [cart, setCart] = useState([]);
  const productTypes = products
    ? Array.from(new Set(products.map((product) => product.component_type)))
    : [];

  useEffect(() => {
    const fetchProducts = async () => {
      const response = await fetch(process.env.REACT_APP_BACKEND_API_URL + "/api/products", {
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
      <ProductForm />
      <SupplierForm cart={cart} clearCart={clearCart} />
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
    </Box>
  );
};

export default Admin;
