import React, { useState } from 'react';
import {
  Box,
  Button,
  HStack,
  Input,
  Select,
  Text,
  VStack,
  useToast,
} from '@chakra-ui/react';
import { useAuthContext } from '../hooks/useAuthContext';
import { useProductsContext } from '../hooks/useProductsContext';
import { apiFetch } from '../functions/apiClient';

const productTypes = [
  'Flooring',
  'Column',
  'Beam',
  'Wall',
  'Stair',
  'Cassettes',
  'Modules',
  'Cages',
  'Other',
  'Innovative Materials',
];

const ProductCard = ({ product, cart, onAddToCart, onRemoveFromCart }) => {
  const { user } = useAuthContext();
  const { dispatchProducts } = useProductsContext();
  const [editing, setEditing] = useState(false);
  const [componentName, setComponentName] = useState(product.component_name);
  const [componentType, setComponentType] = useState(product.component_type);
  const [saving, setSaving] = useState(false);
  const toast = useToast();
  const isInCart = cart.find((item) => item._id === product._id);

  const toggleSelection = () => {
    if (editing) return;
    if (isInCart) {
      onRemoveFromCart(product);
    } else {
      onAddToCart(product);
    }
  };

  const saveProduct = async () => {
    setSaving(true);
    const response = await apiFetch(`/api/products/${product._id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user.token}`,
      },
      body: JSON.stringify({
        component_name: componentName,
        component_type: componentType,
      }),
    });
    const json = await response.json();
    setSaving(false);

    if (!response.ok) {
      toast({
        title: 'Product update failed',
        description: json.error || 'Could not update product',
        status: 'error',
        duration: 4000,
        isClosable: true,
      });
      return;
    }

    dispatchProducts({ type: 'UPDATE_PRODUCT', payload: json });
    setEditing(false);
  };

  const deleteProduct = async () => {
    const response = await apiFetch(`/api/products/${product._id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    });
    const json = await response.json();

    if (!response.ok) {
      toast({
        title: 'Product delete failed',
        description: json.error || 'Could not delete product',
        status: 'error',
        duration: 4000,
        isClosable: true,
      });
      return;
    }

    dispatchProducts({ type: 'DELETE_PRODUCT', payload: json });
  };

  return (
    <Box
      bg={isInCart ? '#DEFFF2' : 'white'}
      borderWidth={1}
      borderColor={isInCart ? 'teal.300' : 'gray.200'}
      borderRadius="md"
      boxShadow="sm"
      p={3}
    >
      {editing ? (
        <VStack align="stretch" spacing={2}>
          <Input size="sm" value={componentName} onChange={(event) => setComponentName(event.target.value)} />
          <Select size="sm" value={componentType} onChange={(event) => setComponentType(event.target.value)}>
            {productTypes.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </Select>
          <HStack>
            <Button size="xs" colorScheme="blue" onClick={saveProduct} isLoading={saving}>Save</Button>
            <Button size="xs" variant="ghost" onClick={() => setEditing(false)}>Cancel</Button>
          </HStack>
        </VStack>
      ) : (
        <VStack align="stretch" spacing={3}>
          <Box cursor="pointer" onClick={toggleSelection}>
            <Text fontWeight="bold">{product.component_name}</Text>
            <Text color="gray.600" fontSize="sm">{product.component_type}</Text>
          </Box>
          <HStack>
            <Button size="xs" variant="outline" onClick={() => setEditing(true)}>Edit</Button>
            <Button size="xs" colorScheme="red" variant="outline" onClick={deleteProduct}>Delete</Button>
          </HStack>
        </VStack>
      )}
    </Box>
  );
};

export default ProductCard;
