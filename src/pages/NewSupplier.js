import { useEffect, useState } from "react";
import { useProductsContext } from "../hooks/useProductsContext";
import { useAuthContext } from '../hooks/useAuthContext';

// components
import ProductCard from '../components/ProductCard';
import SupplierForm from "../components/SupplierForm";

const NewSupplier = () => {
  const { products, dispatchProducts } = useProductsContext()
  const { user } = useAuthContext()
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const response = await fetch('/api/products', {
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

  const handleAddToCart = (product) => {
    if (!cart.find((item) => item._id === product._id)) {
      setCart((prevCart) => [...prevCart, product]);
    }
  };
  console.log(cart)
  
  return (
    <div className="home">
      <SupplierForm cart={cart}/>
      <div className="cart">
        <h4>Products List:</h4>
        <ul>
          {cart.map((product) => (
            <li key={product._id}>{product.component_name} ({product.component_type}) </li>
          ))}
        </ul>
      </div>
      <div className="product-card">
        {products && products.map((product) => (
          <ProductCard 
            key={product._id} 
            product={product}
            onAddToCart={handleAddToCart}
          />
        ))}
      </div>
    </div>
  )
}

export default NewSupplier;