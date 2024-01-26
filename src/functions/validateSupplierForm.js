import { isValidPostcode } from './isValidPostcode';

export const validateSupplierForm = (user, cart, sitePostcode, updateHasValidPostcode) => {
  if (!user) {
    return 'You must be logged in';
  }
  if (cart.length === 0) {
    return 'Please select at least one product.';
  }
  if (sitePostcode === '') {
    return 'Please input a postcode.';
  }
  if (!isValidPostcode(sitePostcode)) {
    updateHasValidPostcode(false);
    return 'Invalid postcode';
  }
  return '';
}
