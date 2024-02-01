import { Tr, Td } from '@chakra-ui/react';

const ViableSupplier = ({ stockist, distance, showRouteButton }) => {
  return (
    <Tr>
      <Td>{stockist.name}</Td>
      <Td>{stockist.postcode}</Td>
      <Td>{distance}</Td>
      <Td>{showRouteButton}</Td>
    </Tr>
  );
};

export default ViableSupplier;
 