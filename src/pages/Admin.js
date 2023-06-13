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
  const productTypes = products
    ? Array.from(new Set(products.map((product) => product.component_type)))
    : [];

  useEffect(() => {
    const fetchProducts = async () => {
      const response = await fetch(process.env.REACT_APP_BACKEND_API_URL + "/api/products", {
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

  const clearCart = () => {
    setCart([]);
  };

  return (
    <div className="home">
      <ProductForm />
      <div>
        <SupplierForm cart={cart} clearCart={clearCart} />
      </div>
      <br />
      {productTypes.reverse().map((type) => (
        <div className="product-container" key={type}>
          <h4 style={{ display: "inline-block" }}>{type}</h4>
          {products &&
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
