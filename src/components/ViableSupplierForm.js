import { useState, useEffect } from "react"
import { useAuthContext } from "../hooks/useAuthContext.js"
import StockistCard from './StockistCard'
import { isValidPostcode } from '../functions/isValidPostcode';

const ViableSupplierForm = ({ cart, suppliers, onNewSearch }) => {
  const { user } = useAuthContext();
  const [sitePostcode, setSitePostcode] = useState('');
  const [cartArray, setCartArray] = useState([]);
  const [error, setError] = useState(null);
  const [updatedCart, setUpdatedCart] = useState([])
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [searching, setSearching] = useState(false);
  
  useEffect(() => {
    setCartArray(cart);
  }, [cart]);

  useEffect(() => {
    setUpdatedCart(cartArray)
  }, [cartArray])

  function findViableSupplier(cartArray) {
    for (let i = 0; i < cartArray.length; i++) {
      const product = cartArray[i]._id;
      let stockists = [];
      for (let j = 0; j < suppliers.length; j++) {
        const supplier = suppliers[j];
        const productIds = supplier.products.map((p) => p._id);
        if (productIds.includes(product)) {
          if (!stockists) {
            stockists = [];
          }
          stockists.push(supplier);
        }
      }
      cartArray[i].stockists = stockists;
      if (!stockists) {
        cartArray[i].stockists = [];
      }
    }
    setUpdatedCart(cartArray);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (searching) {
      // Handle "New Search" button click
      setCartArray([]);
      setSitePostcode('')
      setSearching(false);
      setFormSubmitted(false);
      setError(null)
      onNewSearch();
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
    // Check if postcode is valid when submitting
    if (!isValidPostcode(sitePostcode)) {
      setError('Invalid postcode');
      return;
    } else {
      setError(null); // Clear error if postcode is valid
    }
    findViableSupplier(cartArray, sitePostcode, cart)
    setFormSubmitted(true);
    setSearching(true);
  }

  return (
    <form className="create" onSubmit={handleSubmit} suppliers={suppliers}>
      <h3>Check for suppliers:</h3>
      <div className="input-button-container">
        <input
          type="text"
          id="postcode"
          onChange={(e) => setSitePostcode(e.target.value)}
          value={sitePostcode}
          placeholder="Enter your postcode"
        />
      <center><button onClick={handleSubmit}>
        {searching ? 'New Search' : 'Find Suppliers'}
        </button></center>
        </div>
      {error && <div className="error">{error}</div>}
      {formSubmitted &&
      <div className="search-results-container">
        <h3>Suppliers:</h3>
        {updatedCart && 
          updatedCart.map((item, index) => (
          <StockistCard 
            key={item._id}
            item={item}
            index={index +1}
            sitePostcode={sitePostcode}
            updatedCart={updatedCart}
            token={user.token}
          />
          ))}
      </div>}
    </form>
  );
};

export default ViableSupplierForm;