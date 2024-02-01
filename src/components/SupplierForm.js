import { useState } from "react"
import { useSuppliersContext } from "../hooks/useSuppliersContext.js";
import { useAuthContext } from "../hooks/useAuthContext.js"
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  VStack,
  Text,
  List,
  ListItem,
  Box,
  FormErrorMessage
} from '@chakra-ui/react';

const SupplierForm = ({ cart, clearCart }) => {
  const { dispatchSuppliers } = useSuppliersContext();
  const { user } = useAuthContext();
  const [name, setName] = useState('');
  const [postcode, setPostcode] = useState('');
  const [error, setError] = useState(null);
  const [emptyFields, setEmptyFields] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      setError('You must be logged in');
      return;
    }

    if (cart.length === 0) {
      setError('Please select at least one product.');
      return;
    }

    const supplier = { name, postcode, products: cart };

    const response = await fetch('/api/suppliers', {
      method: 'POST',
      body: JSON.stringify(supplier),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${user.token}`,
      },
    });
    const json = await response.json();

    if (!response.ok) {
      setError(json.error);
      setEmptyFields(json.emptyFields);
    }
    if (response.ok) {
      setError(null);
      setName('');
      setPostcode('');
      setEmptyFields([]);
      cart = [];
      console.log('New Supplier Added', json);
      dispatchSuppliers({ type: 'CREATE_SUPPLIER', payload: json });
      clearCart();
    }
  };

  const isFieldEmpty = (fieldName) => emptyFields.includes(fieldName);

  return (
    <Box as="form" onSubmit={handleSubmit} p={4} borderWidth="1px" borderRadius="lg" boxShadow="sm">
      <VStack spacing={4} align="stretch">
        <Text fontSize="xl">Add a Supplier</Text>
        <FormControl isInvalid={isFieldEmpty('name')}>
          <FormLabel>Name:</FormLabel>
          <Input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          {isFieldEmpty('name') && <FormErrorMessage>Name is required.</FormErrorMessage>}
        </FormControl>
        <FormControl isInvalid={isFieldEmpty('postcode')}>
          <FormLabel>Postcode:</FormLabel>
          <Input
            type="text"
            value={postcode}
            onChange={(e) => setPostcode(e.target.value)}
          />
          {isFieldEmpty('postcode') && <FormErrorMessage>Postcode is required.</FormErrorMessage>}
        </FormControl>
        <Text>Products:</Text>
        <List spacing={2}>
          {cart.map((product) => (
            <ListItem key={product._id}>
              {product.component_name} ({product.component_type})
            </ListItem>
          ))}
        </List>
        <Button colorScheme="blue" type="submit" isLoading={false}>
          Add Supplier
        </Button>
        {error && <Text color="red.500">{error}</Text>}
      </VStack>
    </Box>
  );
};

export default SupplierForm;