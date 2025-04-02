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
} from '@chakra-ui/react';

const LoginModal = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, error, isLoading } = useLogin();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(email, password);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent borderRadius="lg" p={4}>
        <ModalHeader textAlign="center" bg="white" color="blue.600" fontWeight="bold" fontSize="lg">
          Log In
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <form onSubmit={handleSubmit}>
            <VStack spacing={4} align="stretch">
              <FormControl id="email">
                <FormLabel>Email:</FormLabel>
                <Input
                  type="email"
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                  borderRadius="md"
                  borderColor="blue.300"
                />
              </FormControl>
              <FormControl id="password">
                <FormLabel>Password:</FormLabel>
                <Input
                  type="password"
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                  borderRadius="md"
                  borderColor="blue.300"
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
        <ModalFooter>
          <Button
            colorScheme="blue"
            width="full"
            onClick={handleSubmit}
            isLoading={isLoading}
            borderRadius="md"
          >
            Login
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default LoginModal;
