import { useState } from "react";
import { useLogin } from "../hooks/useLogin";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  FormControl,
  FormLabel,
  Input,
  Button,
  VStack,
  Alert,
  AlertIcon,
  Text,
} from '@chakra-ui/react';

const LoginModal = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, error, isLoading } = useLogin();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login(email, password);
    if (!result.error) { // Check if the login was successful
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay bg="blackAlpha.600" backdropFilter="blur(2px)" />
      <ModalContent borderRadius="md" overflow="hidden" boxShadow="2xl" mx={4}>
        <ModalHeader textAlign="center" bg="blue.600" color="white" py={5}>
          Log In
        </ModalHeader>
        <ModalCloseButton color="white" />
        <ModalBody bg="white" px={{ base: 5, md: 8 }} pt={7} pb={2}>
          <Text color="gray.600" textAlign="center" mb={6}>
            Access supplier search, route comparisons, and saved account details.
          </Text>
          <form onSubmit={handleSubmit}>
            <VStack spacing={5} align="stretch">
              <FormControl id="email">
                <FormLabel color="gray.700" fontWeight="semibold">Email</FormLabel>
                <Input
                  type="email"
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                  borderRadius="md"
                  bg="gray.50"
                  borderColor="gray.300"
                  _focus={{ borderColor: 'blue.500', boxShadow: '0 0 0 1px var(--chakra-colors-blue-500)' }}
                />
              </FormControl>
              <FormControl id="password">
                <FormLabel color="gray.700" fontWeight="semibold">Password</FormLabel>
                <Input
                  type="password"
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                  borderRadius="md"
                  bg="gray.50"
                  borderColor="gray.300"
                  _focus={{ borderColor: 'blue.500', boxShadow: '0 0 0 1px var(--chakra-colors-blue-500)' }}
                />
              </FormControl>
              {error && (
                <Alert status="error" borderRadius="md">
                  <AlertIcon />
                  {error}
                </Alert>
              )}
            </VStack>
          </form>
        </ModalBody>
        <ModalFooter bg="white" px={{ base: 5, md: 8 }} pb={8}>
          <Button
            colorScheme="blue"
            width="full"
            onClick={handleSubmit}
            isLoading={isLoading}
            borderRadius="md"
            minH="44px"
          >
            Log In
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default LoginModal;
