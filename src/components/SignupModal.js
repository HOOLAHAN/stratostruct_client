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
  Text,
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
    const result = await signup(email, company, full_name, password, role);
    if (!result.error) { // Check if the signup was successful
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay bg="blackAlpha.600" backdropFilter="blur(2px)" />
      <ModalContent borderRadius="md" overflow="hidden" boxShadow="2xl" mx={4} maxH="92vh">
        <ModalHeader textAlign="center" bg="blue.600" color="white" py={4}>
          Sign Up
        </ModalHeader>
        <ModalCloseButton color="white" />
        <ModalBody bg="white" px={{ base: 5, md: 7 }} pt={5} pb={2} overflowY="auto">
          <Text color="gray.600" textAlign="center" mb={4}>
            Create an account to start finding nearby suppliers for your projects.
          </Text>
          <form onSubmit={handleSubmit}>
            <VStack spacing={3} align="stretch">
              <FormControl id="email">
                <FormLabel color="gray.700" fontWeight="semibold" mb={1}>Email</FormLabel>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  borderRadius="md"
                  bg="gray.50"
                  borderColor="gray.300"
                  _focus={{ borderColor: 'blue.500', boxShadow: '0 0 0 1px var(--chakra-colors-blue-500)' }}
                />
              </FormControl>
              <FormControl id="company">
                <FormLabel color="gray.700" fontWeight="semibold" mb={1}>Company</FormLabel>
                <Input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  borderRadius="md"
                  bg="gray.50"
                  borderColor="gray.300"
                  _focus={{ borderColor: 'blue.500', boxShadow: '0 0 0 1px var(--chakra-colors-blue-500)' }}
                />
              </FormControl>
              <FormControl id="full_name">
                <FormLabel color="gray.700" fontWeight="semibold" mb={1}>Full Name</FormLabel>
                <Input
                  type="text"
                  value={full_name}
                  onChange={(e) => setFullName(e.target.value)}
                  borderRadius="md"
                  bg="gray.50"
                  borderColor="gray.300"
                  _focus={{ borderColor: 'blue.500', boxShadow: '0 0 0 1px var(--chakra-colors-blue-500)' }}
                />
              </FormControl>
              <FormControl id="password">
                <FormLabel color="gray.700" fontWeight="semibold" mb={1}>Password</FormLabel>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
        <ModalFooter bg="white" px={{ base: 5, md: 7 }} pt={3} pb={5}>
          <Button
            colorScheme="blue"
            width="full"
            onClick={handleSubmit}
            isLoading={isLoading}
            borderRadius="md"
            minH="44px"
          >
            Sign Up
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default SignupModal;
