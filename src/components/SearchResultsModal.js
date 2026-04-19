import React, { useMemo, useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Box,
  Button,
  ModalFooter,
  Center,
  Text,
  HStack,
  Badge,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Select,
  VStack,
} from '@chakra-ui/react';

const SearchResultsModal = ({ isOpen, onClose, cart, searchResults, sitePostcode, handleShowRoute, handleRouteChange, handleNewSearch }) => {
  const [sortBy, setSortBy] = useState('recommended');
  
  const handleNewSearchAndClose = () => {
    handleNewSearch();
    onClose();
  };

  const suppliers = useMemo(() => {
    const items = [...(searchResults?.suppliers || [])];

    if (sortBy === 'distance') {
      return items.sort((a, b) => (a.distanceKilometers ?? Infinity) - (b.distanceKilometers ?? Infinity));
    }

    if (sortBy === 'duration') {
      return items.sort((a, b) => (a.durationMinutes ?? Infinity) - (b.durationMinutes ?? Infinity));
    }

    if (sortBy === 'name') {
      return items.sort((a, b) => a.name.localeCompare(b.name));
    }

    return items.sort((a, b) => {
      if (b.matchCount !== a.matchCount) return b.matchCount - a.matchCount;
      return (a.distanceKilometers ?? Infinity) - (b.distanceKilometers ?? Infinity);
    });
  }, [searchResults, sortBy]);

  const onShowRoute = (supplier) => {
    handleShowRoute(supplier.postcode, sitePostcode).then((newRouteData) => {
      if (newRouteData) {
        handleRouteChange(newRouteData);
        onClose();
      }
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="5xl" isCentered scrollBehavior="inside">
      <ModalOverlay />
      <ModalContent maxH="84vh" overflowY="auto" mx={2} mb={2}>
        <ModalCloseButton />
        <ModalHeader
          borderTopLeftRadius="md"
          borderTopRightRadius="md"
          bg="blue.500"
          color="white"
        >
          Supplier Results
        </ModalHeader>
        <ModalBody>
          <VStack align="stretch" spacing={4}>
            <Box>
              <Text fontWeight="bold">Site postcode: {sitePostcode}</Text>
              <Text color="gray.600">
                {cart.length} selected component{cart.length === 1 ? '' : 's'}.
                {suppliers.length > 0 ? ` ${suppliers.length} matching supplier${suppliers.length === 1 ? '' : 's'} found.` : ' No matching suppliers found.'}
              </Text>
            </Box>

            <Tabs colorScheme="blue" isFitted>
              <TabList>
                <Tab>Suppliers</Tab>
                <Tab>Components</Tab>
              </TabList>
              <TabPanels>
                <TabPanel px={0}>
                  <HStack justify="space-between" mb={3} align="center">
                    <Text fontWeight="semibold">Ranked supplier options</Text>
                    <Select size="sm" maxW="220px" value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
                      <option value="recommended">Recommended</option>
                      <option value="distance">Nearest</option>
                      <option value="duration">Shortest drive</option>
                      <option value="name">Name</option>
                    </Select>
                  </HStack>
                  <Box overflowX="auto">
                    <Table size="sm" variant="simple">
                      <Thead>
                        <Tr>
                          <Th>Supplier</Th>
                          <Th>Postcode</Th>
                          <Th isNumeric>Matches</Th>
                          <Th isNumeric>Distance</Th>
                          <Th isNumeric>Drive</Th>
                          <Th>Components</Th>
                          <Th></Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {suppliers.map((supplier) => (
                          <Tr key={supplier._id}>
                            <Td fontWeight="semibold">{supplier.name}</Td>
                            <Td>{supplier.postcode}</Td>
                            <Td isNumeric>{supplier.matchCount}</Td>
                            <Td isNumeric>{supplier.distanceKilometers == null ? 'N/A' : `${supplier.distanceKilometers} km`}</Td>
                            <Td isNumeric>{supplier.durationMinutes == null ? 'N/A' : `${supplier.durationMinutes} min`}</Td>
                            <Td>
                              <HStack spacing={1} wrap="wrap">
                                {supplier.products.map((product) => (
                                  <Badge key={product._id} colorScheme="blue" variant="subtle">
                                    {product.component_name}
                                  </Badge>
                                ))}
                              </HStack>
                            </Td>
                            <Td textAlign="right">
                              <Button
                                size="xs"
                                colorScheme="blue"
                                onClick={() => onShowRoute(supplier)}
                                isDisabled={!supplier.coordinates}
                              >
                                Show Route
                              </Button>
                            </Td>
                          </Tr>
                        ))}
                      </Tbody>
                    </Table>
                  </Box>
                </TabPanel>
                <TabPanel px={0}>
                  <VStack align="stretch" spacing={4}>
                    {(searchResults?.products || []).map((product, index) => (
                      <Box key={product._id} borderWidth={1} borderRadius="md" p={3}>
                        <Text fontWeight="bold">{index + 1}. {product.component_name} ({product.component_type})</Text>
                        <HStack mt={2} spacing={2} wrap="wrap">
                          {product.suppliers.length > 0 ? product.suppliers.map((supplier) => (
                            <Badge key={supplier._id} colorScheme="green" variant="subtle">
                              {supplier.name} {supplier.distanceKilometers == null ? '' : `${supplier.distanceKilometers} km`}
                            </Badge>
                          )) : (
                            <Text color="gray.600">No suppliers available</Text>
                          )}
                        </HStack>
                      </Box>
                    ))}
                  </VStack>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Center w="full">
            <Button 
              colorScheme="red" 
              size="sm" 
              onClick={handleNewSearchAndClose}
            >
              Clear Results
            </Button>
          </Center>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default SearchResultsModal;
