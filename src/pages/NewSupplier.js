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
  
  return (
    <div className="home">
      <div className='supplier-form'>
      <SupplierForm cart={cart}/>
      </div>
      <br/>
      <div className="product-card">
        <h4>Flooring</h4>
        {products && products.filter(product => product.component_type === 'Flooring').map((product) => (
          <ProductCard 
            key={product._id} 
            product={product}
            onAddToCart={handleAddToCart}
          />
        ))}
      </div>
      <div className="product-card">
        <h4>Column</h4>
        {products && products.filter(product => product.component_type === 'Column').map((product) => (
          <ProductCard 
            key={product._id} 
            product={product}
            onAddToCart={handleAddToCart}
          />
        ))}
      </div>
      <div className="product-card">
        <h4>Beam</h4>
        {products && products.filter(product => product.component_type === 'Beam').map((product) => (
          <ProductCard 
            key={product._id} 
            product={product}
            onAddToCart={handleAddToCart}
          />
        ))}
      </div>
      <div className="product-card">
        <h4>Wall</h4>
        {products && products.filter(product => product.component_type === 'Wall').map((product) => (
          <ProductCard 
            key={product._id} 
            product={product}
            onAddToCart={handleAddToCart}
          />
        ))}
      </div>
      <div className="product-card">
        <h4>Stair</h4>
        {products && products.filter(product => product.component_type === 'Stair').map((product) => (
          <ProductCard 
            key={product._id} 
            product={product}
            onAddToCart={handleAddToCart}
          />
        ))}
      </div>
      <div className="product-card">
        <h4>Casettes</h4>
        {products && products.filter(product => product.component_type === 'Casettes').map((product) => (
          <ProductCard 
            key={product._id} 
            product={product}
            onAddToCart={handleAddToCart}
          />
        ))}
      </div>
      <div className="product-card">
        <h4>Modules</h4>
        {products && products.filter(product => product.component_type === 'Modules').map((product) => (
          <ProductCard 
            key={product._id} 
            product={product}
            onAddToCart={handleAddToCart}
          />
        ))}
      </div>
      <div className="product-card">
        <h4>Cages</h4>
        {products && products.filter(product => product.component_type === 'Cages').map((product) => (
          <ProductCard 
            key={product._id} 
            product={product}
            onAddToCart={handleAddToCart}
          />
        ))}
      </div>
      <div className="product-card">
        <h4>Other</h4>
        {products && products.filter(product => product.component_type === 'Other').map((product) => (
          <ProductCard 
            key={product._id} 
            product={product}
            onAddToCart={handleAddToCart}
          />
        ))}
      </div>
      <div className="product-card">
        <h4>Innovative Materials</h4>
        {products && products.filter(product => product.component_type === 'Innovative Materials').map((product) => (
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