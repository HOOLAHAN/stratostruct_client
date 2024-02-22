// SearchResultsModal.jsx
import React from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react';
import StockistCard from './StockistCard';

const SearchResultsModal = ({ isOpen, onClose, cart, sitePostcode, handleShowRoute, token, handleRouteChange }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalCloseButton />
        <ModalHeader>Suppliers:</ModalHeader>
        <ModalBody>
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
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default SearchResultsModal;
