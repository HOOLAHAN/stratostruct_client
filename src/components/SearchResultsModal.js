// SearchResultsModal.jsx
import React from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Box,
} from '@chakra-ui/react';
import StockistCard from './StockistCard';

const SearchResultsModal = ({ isOpen, onClose, cart, sitePostcode, handleShowRoute, token, handleRouteChange }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered scrollBehavior="inside">
      <ModalOverlay />
      <ModalContent maxH="80vh" overflowY="auto" mx={2} mb={2}>
        <ModalCloseButton />
        <ModalHeader   
          borderTopLeftRadius="md" 
          borderTopRightRadius="md" 
          bg="blue.500" 
          color="white"
        >
          Suppliers:
        </ModalHeader>
        <ModalBody>
          <Box>
            {cart.map((product, index) => (
              <StockistCard
                key={product._id}
                product={product}
                index={index + 1}
                sitePostcode={sitePostcode}
                handleShowRoute={handleShowRoute}
                token={token}
                handleRouteChange={handleRouteChange}
                onClose={onClose}
              />
            ))}
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default SearchResultsModal;
