import { useEffect, useState } from "react";
import { useProductsContext } from "../hooks/useProductsContext";
import { useAuthContext } from '../hooks/useAuthContext';
import ViableSupplierForm from "../components/ViableSupplierForm";
import { isValidPostcode } from "../functions/isValidPostcode";
import { fetchProducts } from "../functions/fetchProducts";
import { handleAddToCart } from "../functions/handleAddToCart"
import MapComponent from "../components/MapComponent";

const Home = () => {
  const { products, dispatchProducts } = useProductsContext();
  const { user } = useAuthContext();
  const [cart, setCart] = useState([]);
  const [isNewSearch, setIsNewSearch] = useState(true);
  const [hasValidPostcode, setHasValidPostcode] = useState(false);
  const [sitePostcode, setSitePostcode] = useState('');
  const [error, setError] = useState('');
  const [routeData, setRouteData] = useState(null);

  const updateIsNewSearch = (status) => {
    setIsNewSearch(status);
  };

  const updateHasValidPostcode = (status) => {
    setHasValidPostcode(status);
  };

  useEffect(() => {
    const initializeProducts = async () => {
      if (user) {
        const fetchedProducts = await fetchProducts(user.token);
        dispatchProducts({ type: 'SET_PRODUCTS', payload: fetchedProducts });
      }
    };
    initializeProducts();
  }, [dispatchProducts, user]);

  const onAddToCart = async (product) => {
    await handleAddToCart(product, cart, user, sitePostcode, setCart);
  };

  const handleRemoveFromCart = (product) => {
    setCart((prevCart) => prevCart.filter((item) => item._id !== product._id));
  };

  const handleNewSearch = () => {
    setIsNewSearch(true);
    setCart([]);
  };

  const handleProductClick = (product) => {
    if (!isValidPostcode(sitePostcode)) {
      setError('Please input a valid postcode');
      return;
    }
    setError('');
    if (isNewSearch && hasValidPostcode) {
      if (cart.find((item) => item._id === product._id)) {
        handleRemoveFromCart(product);
      } else {
        onAddToCart(product);
      }
    }
  };

  const productTypes = products
    ? Array.from(new Set(products.map((product) => product.component_type))).reverse()
    : [];

  return (
    <div className="home">
      <MapComponent
        sitePostcode={sitePostcode}
        token={user ? user.token : ''}
        routeData={routeData}
      />
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
          setRouteData={setRouteData}
          routeData={routeData}
        />
      </div>
      {error && <div className="error">{error}</div>}
      <br />
      <h2>Step 2 - Select products required:</h2>
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
