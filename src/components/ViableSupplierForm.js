import { useState } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import StockistCard from './StockistCard';
import { isValidPostcode } from '../functions/isValidPostcode';
import { viableSuppliersSearch } from '../functions/viableSuppliersSearch';

const ViableSupplierForm = ({ cart, onNewSearch, updateIsNewSearch }) => {
  const { user } = useAuthContext();
  const [sitePostcode, setSitePostcode] = useState('');
  const [error, setError] = useState(null);
  const [updatedCart, setUpdatedCart] = useState([]);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [searching, setSearching] = useState(false);

  const findSuppliersForCart = async () => {
    const productIds = cart.map(product => product._id);
    const updatedCartArray = await viableSuppliersSearch(productIds, setError, user.token);
    setUpdatedCart(updatedCartArray);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (searching) {
      // Handle "New Search" button click
      onNewSearch();
      updateIsNewSearch(true);
      setSitePostcode('');
      setSearching(false);
      setFormSubmitted(false);
      setError(null);
      return;
    }

    if (!user) {
      setError('You must be logged in');
      return;
    }

    if (cart.length === 0) {
      setError('Please select at least one product.');
      return;
    }

    if (sitePostcode === '') {
      setError('Please input a postcode.');
      return;
    }

    if (!isValidPostcode(sitePostcode)) {
      setError('Invalid postcode');
      return;
    }

    setError(null); // Clear error if postcode is valid
    updateIsNewSearch(false);

    await findSuppliersForCart();
    setFormSubmitted(true);
    setSearching(true);
  }

  return (
    <form className="create" onSubmit={handleSubmit}>
      <h3>Check for suppliers:</h3>
      <div className="input-button-container">
        <input
          type="text"
          id="postcode"
          onChange={(e) => setSitePostcode(e.target.value)}
          value={sitePostcode}
          placeholder="Enter your postcode"
        />
        <center>
          <button type="submit">
            {searching ? 'New Search' : 'Find Suppliers'}
          </button>
        </center>
      </div>
      {error && <div className="error">{error}</div>}
      {formSubmitted && updatedCart.length > 0 &&
        <div className="search-results-container">
          <h3>Suppliers:</h3>
          {updatedCart.map((item, index) => (
            <StockistCard
              key={item._id}
              item={item}
              index={index + 1}
              sitePostcode={sitePostcode}
              token={user.token}
            />
          ))}
        </div>
      }
    </form>
  );
};

export default ViableSupplierForm;