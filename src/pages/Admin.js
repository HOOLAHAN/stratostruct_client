import { useEffect, useState } from "react";
import { useProductsContext } from "../hooks/useProductsContext";
import { useAuthContext } from "../hooks/useAuthContext";

// components
import ProductCard from "../components/ProductCard";
import SupplierForm from "../components/SupplierForm";
import ProductForm from "../components/ProductForm";

const AddSupplyChainData = () => {
  const { products, dispatchProducts } = useProductsContext();
  const { user } = useAuthContext();
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

  const toggleMaximized = (type) => {
    setIsMaximized((prevIsMaximized) => ({
      ...prevIsMaximized,
      [type]: !prevIsMaximized[type],
    }));
  };

  return (
    <div className="home">
      <ProductForm />
      <div 
      // className="supplier-form"
      >
        <SupplierForm cart={cart} />
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
                <ProductCard key={product._id} product={product} onAddToCart={handleAddToCart} />
              ))}
        </div>
      ))}
    </div>
  );
};

export default AddSupplyChainData;