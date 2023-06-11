import { useEffect, useState } from "react";
import { useSuppliersContext } from "../hooks/useSuppliersContext";
import { useProductsContext } from "../hooks/useProductsContext";
import { useAuthContext } from '../hooks/useAuthContext';

// components
// import ProductCard from '../components/ProductCard';
import ViableSupplierForm from "../components/ViableSupplierForm"

const Home = () => {
  const { suppliers, dispatchSuppliers } = useSuppliersContext()
  const { products, dispatchProducts } = useProductsContext()
  const { user } = useAuthContext()

  const [cart, setCart] = useState([]);
  // eslint-disable-next-line
  const [isNewSearch, setIsNewSearch] = useState(false);

  const [isMaximized, setIsMaximized] = useState({
    'Flooring': false,
    'Column': false,
    'Beam': false,
    'Wall': false,
    'Stair': false,
    'Casettes': false,
    'Modules': false,
    'Cages': false,
    'Other': false,
    'Innovative Materials': false,
  });

  useEffect(() => {
    const fetchProducts = async () => {
      const response = await fetch(process.env.REACT_APP_BACKEND_API_URL + '/api/products', {
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      }) //update endpoint for production
      const json = await response.json()
      if (response.ok) {
        dispatchProducts({type: 'SET_PRODUCTS', payload: json})
      }
    }
    if (user) {
      fetchProducts()
    }
  }, [dispatchProducts, user])

  useEffect(() => {
    const fetchSuppliers = async () => {
      const response = await fetch(process.env.REACT_APP_BACKEND_API_URL + '/api/suppliers', {
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      }) //update endpoint for production
      const json = await response.json()
      if (response.ok) {
        dispatchSuppliers({type: 'SET_SUPPLIERS', payload: json})
      }
    }
    if (user) {
      fetchSuppliers()
    }
  }, [dispatchSuppliers, user])

  const handleAddToCart = (product) => {
    if (!cart.find((item) => item._id === product._id)) {
      setCart((prevCart) => [...prevCart, product]);
    }
  };

  const handleRemoveFromCart = (product) => {
    setCart((prevCart) => prevCart.filter((item) => item._id !== product._id));
  };

  const toggleMaximized = (type) => {
    setIsMaximized((prevIsMaximized) => ({
      ...prevIsMaximized,
      [type]: !prevIsMaximized[type],
    }));
  };

  const handleNewSearch = () => {
    setIsNewSearch(true);
    setCart([]);
  }

  const handleProductClick = (product) => {
    if (cart.find((item) => item._id === product._id)) {
      handleRemoveFromCart(product);
    } else {
      handleAddToCart(product);
    }
  };


  return (
    <div className="home">
      <div>
        <ViableSupplierForm 
          cart={cart} 
          products={products} 
          suppliers={suppliers} 
          onNewSearch={handleNewSearch}
        />
      </div>
      <br/>
      <h3>Select products required from the below list:</h3>
      {Object.entries(isMaximized).map(([type, value]) => (
        <div className="product-container" key={type}>
          <center>
          <button
            className={`product-category ${value ? 'maximized' : ''}`}
            onClick={() => toggleMaximized(type)}
            >
            <h3>{type} {value ? "^" : "v"}</h3>
          </button>
          </center>
          {value &&
            products &&
            products
            .filter((product) => product.component_type === type)
            .map((product) => (
              <button
                className={`product-card ${cart.find((item) => item._id === product._id) ? 'selected' : ''}`}
                onClick={() => handleProductClick(product)}
                key={product._id}
                style={{ backgroundColor: cart.find((item) => item._id === product._id) ? '#DEFFF2' : 'transparent' }}
              >
                <center><p style={{ display: 'inline-block', marginLeft: '5px' }}>
                  <strong>{product.component_name}</strong>
                </p></center>
                <br />
              </button>
            ))}
        </div>
      ))}
    </div>
  );
  
}

export default Home;