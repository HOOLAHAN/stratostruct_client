import { useEffect, useState } from "react";
import { useSuppliersContext } from "../hooks/useSuppliersContext";
import { useProductsContext } from "../hooks/useProductsContext";
import { useAuthContext } from '../hooks/useAuthContext';

// components
import ProductCard from '../components/ProductCard';
import ViableSupplierForm from "../components/ViableSupplierForm"

const Home = () => {
  const { suppliers, dispatchSuppliers } = useSuppliersContext()
  const { products, dispatchProducts } = useProductsContext()
  const { user } = useAuthContext()

  const [cart, setCart] = useState([]);
  const [isMaximized, setIsMaximized] = useState({
    Flooring: false,
    Column: false,
    Beam: false,
    Wall: false,
    Stair: false,
    Casettes: false,
    Modules: false,
    Cages: false,
    Other: false,
    InnovativeMaterials: false,
  });

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

  useEffect(() => {
    const fetchSuppliers = async () => {
      const response = await fetch('/api/suppliers', {
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

    const toggleMaximized = (type) => {
      setIsMaximized((prevIsMaximized) => ({
        ...prevIsMaximized,
        [type]: !prevIsMaximized[type],
      }));
    };

  return (
    <div className="home">
      <div className='supplier-form'>
      <ViableSupplierForm cart={cart} products={products} suppliers={suppliers}/>
      </div>
      <br/>
      <h3>Add products required from the below list:</h3>
      {Object.entries(isMaximized).map(([type, value]) => (
        <div className="product-card" key={type}>
          <h4 style={{ display: "inline-block" }}>{type}</h4>
          <button onClick={() => toggleMaximized(type)} style={{ float: "right" }}>
            {value ? "^" : "v"}
          </button>
          {value &&
            products &&
            products
              .filter((product) => product.component_type === type)
              .map((product) => (
                <ProductCard key={product._id} product={product} onAddToCart={handleAddToCart} />
              ))}
        </div>
      ))}
    </div>
  )
}

export default Home;

/*
<div className="products">
  {suppliers && suppliers.map((supplier) => (
    <SupplierDetails key={supplier._id} supplier={supplier}/>
    ))}
</div>
<div className="products">
  {products && products.map((product) => (
    <ProductDetails key={product._id} product={product}/>
    ))}
</div>
*/