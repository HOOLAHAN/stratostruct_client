import { useState } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import StockistCard from './StockistCard';
import { isValidPostcode } from '../functions/isValidPostcode';
import { viableSuppliersSearch } from '../functions/viableSuppliersSearch';

const ViableSupplierForm = ({ cart, sitePostcode, onNewSearch, updateIsNewSearch, updateHasValidPostcode, setSitePostcode, setError }) => {
  const { user } = useAuthContext();
  const [updatedCart, setUpdatedCart] = useState([]);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [searching, setSearching] = useState(false);

  const findSuppliersForCart = async () => {
    const productIds = cart.map(product => product._id);
    const updatedCartArray = await viableSuppliersSearch(productIds, setError, user.token);
    setUpdatedCart(updatedCartArray);
  }

  const handlePostcodeChange = (e) => {
    const newPostcode = e.target.value;
    setSitePostcode(newPostcode);
    updateHasValidPostcode(isValidPostcode(newPostcode));
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
      updateHasValidPostcode(false);
      return;
    }
    setError('');
    updateHasValidPostcode(true);

    setError(null);
    updateIsNewSearch(false);

    await findSuppliersForCart();
    setFormSubmitted(true);
    setSearching(true);
  }

  return (
    <form className="create" onSubmit={handleSubmit}>
      <h1>Check for suppliers:</h1>
      <h2>Step 1 - Enter your postcode:</h2>
      <div className="input-button-container">
        <input
          type="text"
          id="postcode"
          onChange={handlePostcodeChange}
          value={sitePostcode}
          placeholder="e.g. SE10 8XJ"
        />
        <center>
          <button type="submit">
            {searching ? 'New Search' : 'Find Suppliers'}
          </button>
        </center>
      </div>
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