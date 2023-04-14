import { useState, useEffect } from "react"
import { useAuthContext } from "../hooks/useAuthContext.js"
import StockistCard from './StockistCard'


const ViableSupplierForm = ({ cart, suppliers }) => {
  const { user } = useAuthContext();
  const [sitePostcode, setSitePostcode] = useState('');
  const [cartArray, setCartArray] = useState([]);
  const [error, setError] = useState(null);
  const [emptyFields, setEmptyFields] = useState([]);
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
    console.log('updatedCart');
    console.log(updatedCart);
    return cartArray;
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

    setEmptyFields([])
    findViableSupplier(cartArray, sitePostcode, cart)
    setFormSubmitted(true);
    setSearching(true);
  }

  return (
    <form className="create" onSubmit={handleSubmit} suppliers={suppliers}>
      <h3>Check for suppliers:</h3>
      <label>Postcode:</label>
      <input
        type="text"
        onChange={(e) => setSitePostcode(e.target.value)}
        value={sitePostcode}
        className={emptyFields.includes('postcode') ? 'error' : ''}
      />
      <label>Products Required:</label>
      <div className="cart">
        <ul>
          {cart && cart.map((product) => (
            <li key={product._id}>
              {product.component_name} ({product.component_type})
            </li>
          ))}
        </ul>
      </div>
      <button onClick={handleSubmit}>
        {searching ? 'New Search' : 'Find Suppliers'}
        </button>
      {error && <div className="error">{error}</div>}
      <br/>
      {formSubmitted &&
      <div className="product-container">
         <h3>Suppliers:</h3>
        {updatedCart && 
          updatedCart.map((item) => (
          <StockistCard 
          key={item._id} 
          item={item} 
          sitePostcode={sitePostcode} 
          updatedCart={updatedCart}
          />
          ))}
      </div>}
    </form>
  );
};

export default ViableSupplierForm;