import { useState } from "react";
import { useLogin } from "../hooks/useLogin";
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  VStack,
  Text,
  Alert,
  AlertIcon,
  Box
} from '@chakra-ui/react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, error, isLoading } = useLogin();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(email, password);
  };

  return (
    <Box maxW="400px" mx="auto" mt="5">
      <form onSubmit={handleSubmit}>
        <VStack spacing={4} align="stretch">
          <Text fontSize="2xl" textAlign="center">Log in</Text>
          <FormControl id="email">
            <FormLabel>Email:</FormLabel>
            <Input
              type="email"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />
          </FormControl>
          <FormControl id="password">
            <FormLabel>Password:</FormLabel>
            <Input
              type="password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
            />
          </FormControl>
          <Button
            colorScheme="blue"
            isLoading={isLoading}
            type="submit"
            width="full"
          >
            Login
          </Button>
          {error && (
            <Alert status="error">
              <AlertIcon />
              {error}
            </Alert>
          )}
        </VStack>
      </form>
    </Box>
  );
};

export default Login;