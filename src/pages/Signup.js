import React, { useState } from "react";
import { useSignup } from "../hooks/useSignup";
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  VStack,
  Text,
  Alert,
  AlertIcon,
  Box,
  // RadioGroup,
  // Radio,
  // Stack
} from '@chakra-ui/react';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [full_name, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const { signup, error, isLoading } = useSignup();
  const [role ] = useState("user");

  const handleSubmit = async (e) => {
    e.preventDefault();
    await signup(email, company, full_name, password, role);
  };

  return (
    <Box maxW="400px" mx="auto" mt="5">
      <form onSubmit={handleSubmit}>
        <VStack spacing={4} align="stretch">
          <Text fontSize="2xl" textAlign="center">Sign Up</Text>
          <FormControl id="email">
            <FormLabel>Email</FormLabel>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </FormControl>
          <FormControl id="company">
            <FormLabel>Company</FormLabel>
            <Input type="text" value={company} onChange={(e) => setCompany(e.target.value)} />
          </FormControl>
          <FormControl id="full_name">
            <FormLabel>Full Name</FormLabel>
            <Input type="text" value={full_name} onChange={(e) => setFullName(e.target.value)} />
          </FormControl>
          <FormControl id="password">
            <FormLabel>Password</FormLabel>
            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </FormControl>
          {/* <FormControl as="fieldset">
            <FormLabel as="legend">Role</FormLabel>
            <RadioGroup onChange={setRole} value={role}>
              <Stack direction="row">
                <Radio value="user">User</Radio>
                <Radio value="admin">Admin</Radio>
              </Stack>
            </RadioGroup>
          </FormControl> */}
          <Button colorScheme="blue" isLoading={isLoading} type="submit">
            Sign Up
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

export default Signup;
