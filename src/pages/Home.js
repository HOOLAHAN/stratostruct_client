import { useEffect, useState } from "react";
import { useProductsContext } from "../hooks/useProductsContext";
import { useAuthContext } from '../hooks/useAuthContext';
import ViableSupplierForm from "../components/ViableSupplierForm";
import { isValidPostcode } from "../functions/isValidPostcode";
import { calculateDistance } from "../functions/calculateDistance";

const Home = () => {
  const { products, dispatchProducts } = useProductsContext();
  const { user } = useAuthContext();
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
  };

  useEffect(() => {
    const fetchProducts = async () => {
      const response = await fetch(process.env.REACT_APP_BACKEND_API_URL + '/api/products', {
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });
      const json = await response.json();
      if (response.ok) {
        dispatchProducts({ type: 'SET_PRODUCTS', payload: json });
      }
    };
    if (user) {
      fetchProducts();
    }
  }, [dispatchProducts, user]);

  const fetchStockists = async (product) => {
    try {
      const response = await fetch(process.env.REACT_APP_BACKEND_API_URL + `/api/suppliers/product/${product._id}`, {
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });
      const data = await response.json();
      if (response.ok) {
        return data;
      } else {
        throw new Error(data.error || 'Failed to fetch stockists');
      }
    } catch (error) {
      console.error("Error fetching stockists:", error.message);
      return []; // Return an empty array in case of error
    }
  };

  const handleAddToCart = async (product) => {
    if (!cart.find((item) => item._id === product._id)) {
      const stockists = await fetchStockists(product);
      const stockistsWithDistances = await Promise.all(stockists.map(async (stockist) => {
        try {
          const distance = await calculateDistance(sitePostcode, stockist.postcode, user.token);
          return { ...stockist, distance };
        } catch (error) {
          console.error("Error fetching distance:", error.message);
          return { ...stockist, distance: "N/A" };
        }
      }));

      const updatedProduct = { ...product, stockists: stockistsWithDistances };
      setCart((prevCart) => [...prevCart, updatedProduct]);
    }
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
