import { useEffect, useState } from "react";
import { useProductsContext } from "../hooks/useProductsContext";
import { useAuthContext } from "../hooks/useAuthContext";

// components
import ProductCard from "../components/ProductCard";
import SupplierForm from "../components/SupplierForm";
import ProductForm from "../components/ProductForm";

const Admin = () => {
  const { products, dispatchProducts } = useProductsContext();
  const { user } = useAuthContext();
  const [cart, setCart] = useState([]);
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
      const response = await fetch("/api/products", {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      const json = await response.json();

      if (response.ok) {
        dispatchProducts({ type: "SET_PRODUCTS", payload: json });
      }
    };
    if (user) {
      fetchProducts();
    }
  }, [dispatchProducts, user]);

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

  const clearCart = () => {
    setCart([]);
  };

  // console.log(cart)

  return (
    <div className="home">
      <ProductForm />
    <div>
      <SupplierForm cart={cart} clearCart={clearCart}/>
    </div>
    <br />
      {Object.entries(isMaximized).map(([type, value]) => (
        <div className="product-container" key={type}>
          <h4 style={{ display: "inline-block" }}>{type}</h4>
          <button onClick={() => toggleMaximized(type)} style={{ float: "right" }}>
            {value ? "^" : "v"}
          </button>
          {value &&
            products &&
            products
              .filter((product) => product.component_type === type)
              .map((product) => (
                <ProductCard 
                key={product._id} 
                product={product} 
                onAddToCart={handleAddToCart} 
                onRemoveFromCart={handleRemoveFromCart}
                cart={cart}
                />
              ))}
        </div>
      ))}
    </div>
  );
};

export default Admin;