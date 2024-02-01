import React from 'react';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import { useLogout } from '../hooks/useLogout';
import { useAuthContext } from '../hooks/useAuthContext';
import { Flex, Box, Button, Image, Text, Link } from '@chakra-ui/react';
import SS_logo from "../images/SS_logo.svg";

const Navbar = () => {
  const { logout } = useLogout();
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    if (location.pathname.startsWith('/admin')) {
      navigate('/login');
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
            <Button onClick={handleLogout} size="sm">Logout</Button>
            {user.role === 'admin' && (
              <RouterLink to={location.pathname.startsWith('/admin') ? "/" : "/admin"}>
                <Button size="sm" ml={4}>
                  {location.pathname.startsWith('/admin') ? "Home" : "Admin"}
                </Button>
              </RouterLink>
            )}
          </>
        ) : (
          <Box>
            <Link as={RouterLink} to="/login" mr={2}>Login</Link>
            <Link as={RouterLink} to="/signup">Signup</Link>
          </Box>
        )}
      </Flex>
    </Flex>
  );
};

export default Navbar;
