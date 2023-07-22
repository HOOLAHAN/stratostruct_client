import { useEffect, useState } from "react";
import { useSuppliersContext } from "../hooks/useSuppliersContext";
import { useProductsContext } from "../hooks/useProductsContext";
import { useAuthContext } from '../hooks/useAuthContext';
import ViableSupplierForm from "../components/ViableSupplierForm"
import { Link } from 'react-router-dom';

// components
// import ProductCard from '../components/ProductCard';

const Home = () => {
  const { suppliers, dispatchSuppliers } = useSuppliersContext()
  const { products, dispatchProducts } = useProductsContext()
  const { user } = useAuthContext()

  const [cart, setCart] = useState([]);
  // eslint-disable-next-line
  const [isNewSearch, setIsNewSearch] = useState(false);

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

  const productTypes = products
    ? Array.from(new Set(products.map((product) => product.component_type)))
    : [];

  return (
    
    <div className="home">
      <Link to="/viewer">
        <button>View 3D Model</button>
      </Link>
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
      {productTypes.map((type) => (
        <div className="product-container" key={type}>
          <h3>{type}</h3>
          <br />
          {products &&
            products
            .filter((product) => product.component_type === type)
            .map((product) => (
              <button
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