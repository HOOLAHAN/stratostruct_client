import { useState } from "react";
import { useSignup } from "../hooks/useSignup";
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

const SignupModal = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [full_name, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const { signup, error, isLoading } = useSignup();
  const [role] = useState("user");

  const handleSubmit = async (e) => {
    e.preventDefault();
    await signup(email, company, full_name, password, role);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent borderRadius="lg" p={4}>
        <ModalHeader textAlign="center" bg="white" color="blue.600" fontWeight="bold" fontSize="lg">
          Sign Up
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <form onSubmit={handleSubmit}>
            <VStack spacing={4} align="stretch">
              <FormControl id="email">
                <FormLabel>Email:</FormLabel>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  borderRadius="md"
                  borderColor="blue.300"
                />
              </FormControl>
              <FormControl id="company">
                <FormLabel>Company:</FormLabel>
                <Input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  borderRadius="md"
                  borderColor="blue.300"
                />
              </FormControl>
              <FormControl id="full_name">
                <FormLabel>Full Name:</FormLabel>
                <Input
                  type="text"
                  value={full_name}
                  onChange={(e) => setFullName(e.target.value)}
                  borderRadius="md"
                  borderColor="blue.300"
                />
              </FormControl>
              <FormControl id="password">
                <FormLabel>Password:</FormLabel>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
            Sign Up
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default SignupModal;
