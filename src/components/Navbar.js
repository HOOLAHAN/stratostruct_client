import React, { useState } from 'react';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import { useLogout } from '../hooks/useLogout';
import { useAuthContext } from '../hooks/useAuthContext';
import { Flex, Box, Button, Image, Text } from '@chakra-ui/react';
import SS_logo from "../images/SS_logo.svg";
import LoginModal from "./LoginModal";
import SignupModal from "./SignupModal";
import DeleteAccountModal from "./DeleteAccountModal";

const Navbar = () => {
  const { logout } = useLogout();
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const location = useLocation();

  const [isLoginOpen, setLoginOpen] = useState(false);
  const [isSignupOpen, setSignupOpen] = useState(false);
  const [isDeleteOpen, setDeleteOpen] = useState(false);

  const handleLogout = () => {
    logout();
    if (location.pathname.startsWith('/admin')) {
      navigate('/');
    }
  };

  return (
    <Flex as="header" align="center" justify="space-between" padding="0.5rem" bg="blue.500" color="white">
      <Box>
        <RouterLink to="/">
          <Image src={SS_logo} alt="logo" height="auto" width={{ base: "125px", md: "150px" }}/>
        </RouterLink>
      </Box>
      <Flex align="center">
        {user ? (
          <>
            <Text mr={4}>{user.full_name}</Text>
            <Button onClick={handleLogout} size="sm" mr={2}>Log Out</Button>
            <Button onClick={() => setDeleteOpen(true)} size="sm" mr={2}>
              Delete Account
            </Button>
          </>
        ) : (
          <>
            <Button size="sm" mr={2} onClick={() => setLoginOpen(true)}>Log In</Button>
            <Button size="sm" onClick={() => setSignupOpen(true)}>Sign Up</Button>
          </>
        )}
      </Flex>

      <LoginModal isOpen={isLoginOpen} onClose={() => setLoginOpen(false)} />
      <SignupModal isOpen={isSignupOpen} onClose={() => setSignupOpen(false)} />
      <DeleteAccountModal isOpen={isDeleteOpen} onClose={() => setDeleteOpen(false)} />
    </Flex>
  );
};

export default Navbar;
