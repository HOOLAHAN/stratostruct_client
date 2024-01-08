import { useEffect, useState } from "react";
import { useProductsContext } from "../hooks/useProductsContext";
import { useAuthContext } from '../hooks/useAuthContext';
import ViableSupplierForm from "../components/ViableSupplierForm"
import { isValidPostcode } from "../functions/isValidPostcode";

const Home = () => {
  const { products, dispatchProducts } = useProductsContext()
  const { user } = useAuthContext()
  const [cart, setCart] = useState([]);
  const [isNewSearch, setIsNewSearch] = useState(true);
  const [hasValidPostcode, setHasValidPostcode] = useState(false);
  const [sitePostcode, setSitePostcode] = useState('');
  const [error, setError] = useState('');

  const updateIsNewSearch = (status) => {
    setIsNewSearch(status);
  };

  const updateHasValidPostcode = (status) => {
    setHasValidPostcode(status);
  }

  useEffect(() => {
    const fetchProducts = async () => {
      const response = await fetch(process.env.REACT_APP_BACKEND_API_URL + '/api/products', {
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      }) 
      const json = await response.json()
      if (response.ok) {
        dispatchProducts({type: 'SET_PRODUCTS', payload: json})
      }
    }
    if (user) {
      fetchProducts()
    }
  }, [dispatchProducts, user])

  const handleAddToCart = (product) => {
    if (!cart.find((item) => item._id === product._id)) {
      setCart((prevCart) => [...prevCart, product]);
    }
  };

  const handleRemoveFromCart = (product) => {
    setCart((prevCart) => prevCart.filter((item) => item._id !== product._id));
  };

  const handleNewSearch = () => {
    setIsNewSearch(true);
    setCart([]);
  }

  const handleProductClick = (product) => {
    if (!isValidPostcode(sitePostcode)) {
      setError('Please input a valid postcode');
      return;
    }
    setError(''); // Clear any previous error
    if (isNewSearch && hasValidPostcode) {
      if (cart.find((item) => item._id === product._id)) {
        handleRemoveFromCart(product);
      } else {
        handleAddToCart(product);
      }
    }
  };

  const productTypes = products
    ? Array.from(new Set(products.map((product) => product.component_type))).reverse()
    : [];

  return (
    
    <div className="home">
      <div>
        <ViableSupplierForm 
          cart={cart}
          sitePostcode={sitePostcode}
          setSitePostcode={setSitePostcode}
          products={products} 
          onNewSearch={handleNewSearch}
          updateIsNewSearch={updateIsNewSearch}
          updateHasValidPostcode={updateHasValidPostcode}
          error={error}
          setError={setError}
        />
      </div>
      {error && <div className="error">{error}</div>}
      <br/>
      <h3>Select products required from the below list:</h3>
      {productTypes.map((type) => (
        <div className="product-container" key={type}>
          <h3>{type}</h3>
          <br />
          {products &&
            products
            .filter((product) => product.component_type === type)
            .map((product) => (
              <button
                disabled={!isNewSearch}
                className={`product-card ${cart.find((item) => item._id === product._id) ? 'selected' : ''}`}
                onClick={() => handleProductClick(product)}
                key={product._id}
                style={{ backgroundColor: cart.find((item) => item._id === product._id) ? '#DEFFF2' : 'transparent' }}
              >
                <center>
                  <p style={{ display: 'inline-block', marginLeft: '5px' }}>
                    <strong>{product.component_name}</strong>
                  </p>
                </center>
                <br />
              </button>
            ))}
        </div>
      ))}
    </div>
  );
  
}

export default Home;