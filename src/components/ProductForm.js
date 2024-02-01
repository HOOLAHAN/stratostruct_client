import { useState } from "react"
import { useProductsContext } from "../hooks/useProductsContext.js"
import { useAuthContext } from "../hooks/useAuthContext.js"
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  VStack,
  Text,
  Select,
  FormErrorMessage,
  Box
} from '@chakra-ui/react';

const productTypes = [
  "Select Component Type",
  "Flooring",
  "Column",
  "Beam",
  "Wall",
  "Stair",
  "Casettes",
  "Modules",
  "Cages",
  "Other",
  "Innovative Materials",
];

const ProductForm = () => {
  const { dispatchProducts } = useProductsContext()
  const { user } = useAuthContext()

  const [component_type, setComponentType] = useState('')
  const [component_name, setComponentName] = useState('')
  const [error, setError] = useState(null)
  const [emptyFields, setEmptyFields] = useState([])

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!user) {
      setError('You must be logged in')
      return
    }

    const product = {component_type, component_name}
    
    const response = await fetch('/api/products', {
      method: 'POST',
      body: JSON.stringify(product),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${user.token}`
      }
    })
    const json = await response.json()

    // if (!response.ok) {
    //   setError(json.error)
    //   setEmptyFields(json.emptyFields)
    // }
    if (!response.ok) {
      let errorMessage;
      if (response.status === 403) {
        errorMessage = 'You do not have permission to perform this action';
      } else if (response.status === 400 && json.error === 'Empty fields') {
        errorMessage = 'Please fill in all required fields';
      } else {
        errorMessage = 'An error occurred while adding the product';
      }
      const emptyFields = {};
      if (json.emptyFields) {
        json.emptyFields.forEach((field) => {
          emptyFields[field] = true;
        });
      }
      setError(errorMessage);
      setEmptyFields(emptyFields);
    }

    if (response.ok) {
      setError(null)
      setComponentType('')
      setComponentName('')
      setEmptyFields([])
      console.log("New Product Added", json)
      dispatchProducts({type: 'CREATE_PRODUCT', payload: json})
    }
  }

  const isError = field => !!emptyFields[field];

  return (
    <Box maxW="500px" mx="auto" p={5}>
      <VStack as="form" onSubmit={handleSubmit} spacing={4}>
        <Text fontSize="2xl">Add a Product</Text>
        <FormControl isInvalid={isError('component_type')}>
          <FormLabel>Component Type:</FormLabel>
          <Select
            placeholder="Select Component Type"
            onChange={(e) => setComponentType(e.target.value)}
            value={component_type}
          >
            {productTypes.map((type, index) => (
              <option key={index} value={type === "Select Component Type" ? "" : type}>
                {type}
              </option>
            ))}
          </Select>
          {isError('component_type') && <FormErrorMessage>Component type is required.</FormErrorMessage>}
        </FormControl>
        <FormControl isInvalid={isError('component_name')}>
          <FormLabel>Component Name:</FormLabel>
          <Input
            type="text"
            onChange={(e) => setComponentName(e.target.value)}
            value={component_name}
          />
          {isError('component_name') && <FormErrorMessage>Component name is required.</FormErrorMessage>}
        </FormControl>
        <Button type="submit" colorScheme="blue" isLoading={false} loadingText="Submitting">
          Add Product
        </Button>
        {error && <Text color="red.500">{error}</Text>}
      </VStack>
    </Box>
  );
};

export default ProductForm;