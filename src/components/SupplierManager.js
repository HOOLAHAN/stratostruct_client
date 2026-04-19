import { useEffect, useState } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import { apiFetch } from "../functions/apiClient";
import {
  Box,
  Button,
  HStack,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  Badge,
  useToast,
} from "@chakra-ui/react";

const SupplierManager = () => {
  const { user } = useAuthContext();
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  useEffect(() => {
    const fetchSuppliers = async () => {
      if (!user) return;

      setLoading(true);
      try {
        const response = await apiFetch('/api/suppliers', {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        const json = await response.json();

        if (!response.ok) {
          throw new Error(json.error || 'Failed to fetch suppliers');
        }

        setSuppliers(json);
      } catch (error) {
        toast({
          title: 'Could not load suppliers',
          description: error.message,
          status: 'error',
          duration: 4000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchSuppliers();
  }, [toast, user]);

  const deleteSupplier = async (supplier) => {
    const response = await apiFetch(`/api/suppliers/${supplier._id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    });

    const json = await response.json();
    if (!response.ok) {
      toast({
        title: 'Delete failed',
        description: json.error || 'Could not delete supplier',
        status: 'error',
        duration: 4000,
        isClosable: true,
      });
      return;
    }

    setSuppliers((currentSuppliers) => currentSuppliers.filter((item) => item._id !== supplier._id));
    toast({
      title: 'Supplier deleted',
      status: 'success',
      duration: 2500,
      isClosable: true,
    });
  };

  return (
    <Box borderWidth={1} borderRadius="md" p={4}>
      <HStack justify="space-between" mb={4}>
        <Box>
          <Text fontSize="xl" fontWeight="semibold">Supplier Directory</Text>
          <Text color="gray.600">{suppliers.length} supplier{suppliers.length === 1 ? '' : 's'} in the system</Text>
        </Box>
        {loading && <Badge colorScheme="blue">Loading</Badge>}
      </HStack>

      <Box overflowX="auto">
        <Table size="sm">
          <Thead>
            <Tr>
              <Th>Name</Th>
              <Th>Postcode</Th>
              <Th isNumeric>Products</Th>
              <Th></Th>
            </Tr>
          </Thead>
          <Tbody>
            {suppliers.map((supplier) => (
              <Tr key={supplier._id}>
                <Td fontWeight="semibold">{supplier.name}</Td>
                <Td>{supplier.postcode}</Td>
                <Td isNumeric>{supplier.products?.length || 0}</Td>
                <Td textAlign="right">
                  <Button size="xs" colorScheme="red" variant="outline" onClick={() => deleteSupplier(supplier)}>
                    Delete
                  </Button>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
    </Box>
  );
};

export default SupplierManager;
