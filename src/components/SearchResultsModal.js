import React, { useEffect, useMemo, useState } from 'react';
import {
  Badge,
  Box,
  Button,
  Divider,
  HStack,
  Input,
  NumberInput,
  NumberInputField,
  Select,
  SimpleGrid,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  VStack,
  useToast,
} from '@chakra-ui/react';

const SAVED_SEARCHES_KEY = 'stratostruct_saved_searches';

const getSavedSearches = () => {
  try {
    return JSON.parse(localStorage.getItem(SAVED_SEARCHES_KEY) || '[]');
  } catch {
    return [];
  }
};

const supplierDistance = (supplier) => supplier.distanceKilometers ?? Infinity;
const supplierDuration = (supplier) => supplier.durationMinutes ?? Infinity;

const SearchResultsModal = ({
  isOpen,
  onClose,
  cart,
  searchResults,
  sitePostcode,
  handleShowRoute,
  handleRouteChange,
  handleNewSearch,
  onSupplierSelect,
  selectedSupplierId,
  onLoadSavedSearch,
}) => {
  const [sortBy, setSortBy] = useState('recommended');
  const [maxDistance, setMaxDistance] = useState('');
  const [minMatches, setMinMatches] = useState(1);
  const [hideUnavailable, setHideUnavailable] = useState(false);
  const [projectName, setProjectName] = useState('');
  const [savedSearches, setSavedSearches] = useState([]);
  const toast = useToast();

  useEffect(() => {
    setSavedSearches(getSavedSearches());
  }, [isOpen]);

  const suppliers = useMemo(() => {
    const distanceLimit = maxDistance === '' ? Infinity : Number(maxDistance);
    const items = [...(searchResults?.suppliers || [])].filter((supplier) => {
      if (hideUnavailable && supplier.distanceKilometers == null) return false;
      if ((supplier.matchCount || 0) < minMatches) return false;
      if (supplier.distanceKilometers != null && supplier.distanceKilometers > distanceLimit) return false;
      return true;
    });

    if (sortBy === 'distance') {
      return items.sort((a, b) => supplierDistance(a) - supplierDistance(b));
    }

    if (sortBy === 'duration') {
      return items.sort((a, b) => supplierDuration(a) - supplierDuration(b));
    }

    if (sortBy === 'name') {
      return items.sort((a, b) => a.name.localeCompare(b.name));
    }

    return items.sort((a, b) => {
      if (b.matchCount !== a.matchCount) return b.matchCount - a.matchCount;
      return supplierDistance(a) - supplierDistance(b);
    });
  }, [hideUnavailable, maxDistance, minMatches, searchResults, sortBy]);

  const bestSupplierSet = useMemo(() => {
    const uncovered = new Set(cart.map((product) => product._id));
    const chosen = [];
    const candidates = [...(searchResults?.suppliers || [])]
      .filter((supplier) => supplier.products?.length)
      .sort((a, b) => {
        if (b.matchCount !== a.matchCount) return b.matchCount - a.matchCount;
        return supplierDistance(a) - supplierDistance(b);
      });

    while (uncovered.size > 0 && candidates.length > 0) {
      const next = candidates
        .map((supplier) => ({
          supplier,
          covers: supplier.products.filter((product) => uncovered.has(product._id)),
        }))
        .filter((item) => item.covers.length > 0)
        .sort((a, b) => {
          if (b.covers.length !== a.covers.length) return b.covers.length - a.covers.length;
          return supplierDistance(a.supplier) - supplierDistance(b.supplier);
        })[0];

      if (!next) break;
      chosen.push(next);
      next.covers.forEach((product) => uncovered.delete(product._id));
      candidates.splice(candidates.findIndex((supplier) => supplier._id === next.supplier._id), 1);
    }

    return { chosen, uncovered };
  }, [cart, searchResults]);

  const onShowRoute = (supplier) => {
    onSupplierSelect?.(supplier._id);
    handleShowRoute(supplier.postcode, sitePostcode).then((newRouteData) => {
      if (newRouteData) {
        handleRouteChange(newRouteData);
      }
    });
  };

  const saveSearch = () => {
    if (!searchResults) return;

    const savedSearch = {
      id: `${Date.now()}`,
      name: projectName.trim() || `${sitePostcode} search`,
      createdAt: new Date().toISOString(),
      sitePostcode,
      cart,
      searchResults,
    };
    const nextSavedSearches = [savedSearch, ...getSavedSearches()].slice(0, 20);
    localStorage.setItem(SAVED_SEARCHES_KEY, JSON.stringify(nextSavedSearches));
    setSavedSearches(nextSavedSearches);
    setProjectName('');
    toast({
      title: 'Search saved',
      status: 'success',
      duration: 2500,
      isClosable: true,
    });
  };

  const deleteSavedSearch = (savedSearchId) => {
    const nextSavedSearches = savedSearches.filter((savedSearch) => savedSearch.id !== savedSearchId);
    localStorage.setItem(SAVED_SEARCHES_KEY, JSON.stringify(nextSavedSearches));
    setSavedSearches(nextSavedSearches);
  };

  const exportCsv = () => {
    const rows = [
      ['Supplier', 'Postcode', 'Matches', 'Distance km', 'Drive minutes', 'Components'],
      ...suppliers.map((supplier) => [
        supplier.name,
        supplier.postcode,
        supplier.matchCount,
        supplier.distanceKilometers ?? '',
        supplier.durationMinutes ?? '',
        supplier.products.map((product) => product.component_name).join('; '),
      ]),
    ];

    const csv = rows
      .map((row) => row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(','))
      .join('\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8;' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = `stratostruct-suppliers-${sitePostcode || 'search'}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (!isOpen || !searchResults) return null;

  return (
    <Box
      position="fixed"
      top={{ base: '72px', md: '82px' }}
      right={{ base: 3, md: 5 }}
      bottom={{ base: 3, md: 5 }}
      w={{ base: 'calc(100vw - 24px)', md: '500px' }}
      bg="white"
      borderRadius="lg"
      boxShadow="0 24px 80px rgba(15, 23, 42, 0.24)"
      borderWidth="1px"
      borderColor="blue.100"
      zIndex={2}
      overflow="hidden"
    >
      <VStack align="stretch" h="full" spacing={0}>
        <Box bg="blue.700" color="white" px={5} py={4}>
          <HStack justify="space-between" align="start" spacing={4}>
            <Box>
              <Text fontWeight="bold" fontSize="lg" lineHeight="1.1">Supplier Results</Text>
              <Text fontSize="sm" color="blue.50">
                {sitePostcode} search
              </Text>
            </Box>
            <Button size="xs" variant="outline" colorScheme="whiteAlpha" color="white" onClick={onClose}>
              Hide
            </Button>
          </HStack>
          <SimpleGrid columns={3} spacing={2} mt={4}>
            <Box bg="whiteAlpha.200" borderRadius="md" px={3} py={2}>
              <Text fontSize="xs" color="blue.50">Components</Text>
              <Text fontWeight="bold">{cart.length}</Text>
            </Box>
            <Box bg="whiteAlpha.200" borderRadius="md" px={3} py={2}>
              <Text fontSize="xs" color="blue.50">Suppliers</Text>
              <Text fontWeight="bold">{suppliers.length}</Text>
            </Box>
            <Box bg="whiteAlpha.200" borderRadius="md" px={3} py={2}>
              <Text fontSize="xs" color="blue.50">Best Set</Text>
              <Text fontWeight="bold">{bestSupplierSet.chosen.length || '-'}</Text>
            </Box>
          </SimpleGrid>
        </Box>

        <Box overflowY="auto" flex="1" px={5} py={4} bg="gray.50" color="gray.800">
          <Tabs colorScheme="blue" variant="soft-rounded">
            <TabList bg="white" borderRadius="md" p={1} borderWidth={1} borderColor="gray.200">
              <Tab>Ranked</Tab>
              <Tab>Best Set</Tab>
              <Tab>Save</Tab>
            </TabList>

            <TabPanels>
              <TabPanel px={0}>
                <VStack align="stretch" spacing={3}>
                  <Box bg="white" borderWidth={1} borderColor="gray.200" borderRadius="md" p={3} color="gray.800">
                    <Text fontWeight="semibold" color="gray.800" mb={3}>Filter results</Text>
                    <SimpleGrid columns={{ base: 2, md: 4 }} spacing={3}>
                    <Box>
                      <Text fontSize="xs" fontWeight="semibold" color="gray.700" mb={1}>Sort</Text>
                      <Select
                        size="sm"
                        value={sortBy}
                        onChange={(event) => setSortBy(event.target.value)}
                        bg="white"
                        color="gray.900"
                        borderColor="gray.300"
                        _hover={{ borderColor: 'gray.400' }}
                        _focus={{ borderColor: 'blue.500', boxShadow: '0 0 0 1px var(--chakra-colors-blue-500)' }}
                      >
                        <option value="recommended">Recommended</option>
                        <option value="distance">Nearest</option>
                        <option value="duration">Shortest drive</option>
                        <option value="name">Name</option>
                      </Select>
                    </Box>
                    <Box>
                      <Text fontSize="xs" fontWeight="semibold" color="gray.700" mb={1}>Max km</Text>
                      <NumberInput size="sm" min={0} value={maxDistance} onChange={(value) => setMaxDistance(value)}>
                        <NumberInputField
                          placeholder="Any"
                          bg="white"
                          color="gray.900"
                          borderColor="gray.300"
                          _placeholder={{ color: 'gray.500' }}
                          _hover={{ borderColor: 'gray.400' }}
                          _focus={{ borderColor: 'blue.500', boxShadow: '0 0 0 1px var(--chakra-colors-blue-500)' }}
                        />
                      </NumberInput>
                    </Box>
                    <Box>
                      <Text fontSize="xs" fontWeight="semibold" color="gray.700" mb={1}>Min match</Text>
                      <NumberInput size="sm" min={1} value={minMatches} onChange={(value) => setMinMatches(Number(value) || 1)}>
                        <NumberInputField
                          bg="white"
                          color="gray.900"
                          borderColor="gray.300"
                          _hover={{ borderColor: 'gray.400' }}
                          _focus={{ borderColor: 'blue.500', boxShadow: '0 0 0 1px var(--chakra-colors-blue-500)' }}
                        />
                      </NumberInput>
                    </Box>
                    <Box>
                      <Text fontSize="xs" fontWeight="semibold" color="gray.700" mb={1}>Availability</Text>
                      <Button w="full" size="sm" variant={hideUnavailable ? 'solid' : 'outline'} colorScheme="blue" onClick={() => setHideUnavailable((value) => !value)}>
                        Routes only
                      </Button>
                    </Box>
                    </SimpleGrid>
                  </Box>

                  {suppliers.length === 0 ? (
                    <Box bg="white" borderWidth={1} borderRadius="md" p={4}>
                      <Text fontWeight="semibold">No suppliers match these filters.</Text>
                      <Text color="gray.600">Try increasing the distance limit or lowering the match count.</Text>
                    </Box>
                  ) : suppliers.map((supplier) => (
                    <Box
                      key={supplier._id}
                      borderWidth={1}
                      borderColor={selectedSupplierId === supplier._id ? 'blue.500' : 'gray.200'}
                      bg="white"
                      borderRadius="md"
                      boxShadow={selectedSupplierId === supplier._id ? '0 0 0 1px var(--chakra-colors-blue-500), 0 12px 28px rgba(49, 130, 206, 0.16)' : 'sm'}
                      p={4}
                    >
                      <HStack justify="space-between" align="start">
                        <Box>
                          <Text fontWeight="bold" color="gray.900" fontSize="md">{supplier.name}</Text>
                          <Text color="gray.600" fontSize="sm">{supplier.postcode}</Text>
                        </Box>
                        <Badge colorScheme={supplier.matchCount > 1 ? 'green' : 'blue'}>
                          {supplier.matchCount} match{supplier.matchCount === 1 ? '' : 'es'}
                        </Badge>
                      </HStack>
                      <SimpleGrid columns={2} spacing={2} mt={3}>
                        <Box bg="gray.50" borderRadius="md" px={3} py={2}>
                          <Text fontSize="xs" color="gray.500">Distance</Text>
                          <Text fontWeight="semibold" color="gray.800">{supplier.distanceKilometers == null ? 'N/A' : `${supplier.distanceKilometers} km`}</Text>
                        </Box>
                        <Box bg="gray.50" borderRadius="md" px={3} py={2}>
                          <Text fontSize="xs" color="gray.500">Drive time</Text>
                          <Text fontWeight="semibold" color="gray.800">{supplier.durationMinutes == null ? 'N/A' : `${supplier.durationMinutes} min`}</Text>
                        </Box>
                      </SimpleGrid>
                      <HStack mt={3} spacing={2} flexWrap="wrap">
                        {supplier.products.map((product) => (
                          <Badge key={product._id} colorScheme="blue" variant="subtle">
                            {product.component_name}
                          </Badge>
                        ))}
                      </HStack>
                      <HStack mt={3}>
                        <Button size="sm" colorScheme="blue" onClick={() => onShowRoute(supplier)} isDisabled={!supplier.coordinates}>
                          Show Route
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => onSupplierSelect?.(supplier._id)}>
                          Highlight
                        </Button>
                      </HStack>
                    </Box>
                  ))}
                </VStack>
              </TabPanel>

              <TabPanel px={0}>
                <VStack align="stretch" spacing={4}>
                  <Box borderWidth={1} borderRadius="md" p={3} bg="white" color="gray.800">
                    <Text fontWeight="bold" color="gray.900">Recommended supplier set</Text>
                    <Text color="gray.600" fontSize="sm">
                      Prioritises suppliers that cover the most selected components, then nearest distance.
                    </Text>
                  </Box>

                  {bestSupplierSet.chosen.map((item, index) => (
                    <Box key={item.supplier._id} borderWidth={1} borderRadius="md" p={3} bg="white" color="gray.800">
                      <Text fontWeight="bold" color="gray.900">{index + 1}. {item.supplier.name}</Text>
                      <Text color="gray.600" fontSize="sm">
                        {item.supplier.postcode} · {item.supplier.distanceKilometers ?? 'N/A'} km · {item.supplier.durationMinutes ?? 'N/A'} min
                      </Text>
                      <HStack mt={2} wrap="wrap">
                        {item.covers.map((product) => (
                          <Badge key={product._id} colorScheme="green" variant="subtle">
                            {product.component_name}
                          </Badge>
                        ))}
                      </HStack>
                    </Box>
                  ))}

                  {bestSupplierSet.uncovered.size > 0 && (
                    <Box borderWidth={1} borderRadius="md" p={3} borderColor="orange.300" bg="orange.50">
                      <Text fontWeight="semibold">Some components are not covered by the supplier set.</Text>
                    </Box>
                  )}
                </VStack>
              </TabPanel>

              <TabPanel px={0}>
                <VStack align="stretch" spacing={4}>
                  <Box bg="white" borderWidth={1} borderRadius="md" p={3} color="gray.800">
                    <Text fontWeight="semibold" color="gray.900" mb={2}>Save this search</Text>
                    <HStack>
                      <Input
                        size="sm"
                        placeholder="Project name"
                        value={projectName}
                        onChange={(event) => setProjectName(event.target.value)}
                        bg="white"
                        color="gray.900"
                        borderColor="gray.300"
                        _placeholder={{ color: 'gray.500' }}
                        _hover={{ borderColor: 'gray.400' }}
                        _focus={{ borderColor: 'blue.500', boxShadow: '0 0 0 1px var(--chakra-colors-blue-500)' }}
                      />
                      <Button size="sm" colorScheme="blue" onClick={saveSearch}>Save</Button>
                    </HStack>
                  </Box>

                  <Divider />

                  <Box>
                    <Text fontWeight="semibold" color="gray.900" mb={2}>Saved searches</Text>
                    <VStack align="stretch" spacing={2}>
                      {savedSearches.length === 0 ? (
                        <Text color="gray.600">No saved searches yet.</Text>
                      ) : savedSearches.map((savedSearch) => (
                        <Box key={savedSearch.id} borderWidth={1} borderRadius="md" p={3} bg="white" color="gray.800">
                          <HStack justify="space-between" align="start">
                            <Box>
                              <Text fontWeight="semibold" color="gray.900">{savedSearch.name}</Text>
                              <Text color="gray.600" fontSize="sm">
                                {savedSearch.sitePostcode} · {new Date(savedSearch.createdAt).toLocaleDateString()}
                              </Text>
                            </Box>
                            <HStack>
                              <Button size="xs" colorScheme="blue" onClick={() => onLoadSavedSearch?.(savedSearch)}>
                                Load
                              </Button>
                              <Button size="xs" variant="outline" colorScheme="red" onClick={() => deleteSavedSearch(savedSearch.id)}>
                                Delete
                              </Button>
                            </HStack>
                          </HStack>
                        </Box>
                      ))}
                    </VStack>
                  </Box>
                </VStack>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>

        <Box borderTopWidth={1} p={3} bg="white">
          <HStack justify="space-between">
            <Button size="sm" variant="outline" onClick={exportCsv}>
              Export CSV
            </Button>
            <Button size="sm" colorScheme="red" variant="outline" onClick={handleNewSearch}>
              Clear Results
            </Button>
          </HStack>
        </Box>
      </VStack>
    </Box>
  );
};

export default SearchResultsModal;
