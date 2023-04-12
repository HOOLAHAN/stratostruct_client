import { useEffect, useState } from "react";
import { useSuppliersContext } from "../hooks/useSuppliersContext";
import { useProductsContext } from "../hooks/useProductsContext";
import { useAuthContext } from '../hooks/useAuthContext';

// components
// import ProductDetails from '../components/ProductDetails';
// import SupplierDetails from "../components/SupplierDetails";
import ProductCard from '../components/ProductCard';
// import ViableSuppliers from "../components/ViableSuppliers";
import ViableSupplierForm from "../components/ViableSupplierForm"

const Home = () => {
  const { suppliers, dispatchSuppliers } = useSuppliersContext()
  const { products, dispatchProducts } = useProductsContext()
  const { user } = useAuthContext()

  const [cart, setCart] = useState([]);
  // const [sitePostcode, setSitePostcode] = useState('')

  const [isMaximizedFlooring, setIsMaximizedFlooring] = useState(false);
  const [isMaximizedColumn, setIsMaximizedColumn] = useState(false);
  const [isMaximizedBeam, setIsMaximizedBeam] = useState(false);
  const [isMaximizedWall, setIsMaximizedWall] = useState(false);
  const [isMaximizedStair, setIsMaximizedStair] = useState(false);
  const [isMaximizedCasettes, setIsMaximizedCasettes] = useState(false);
  const [isMaximizedModules, setIsMaximizedModules] = useState(false);
  const [isMaximizedCages, setIsMaximizedCages] = useState(false);
  const [isMaximizedOther, setIsMaximizedOther] = useState(false);
  const [isMaximizedInnovativeMaterials, setIsMaximizedInnovativeMaterials] = useState(false);



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
  
    const toggleMaximizedFlooring = () => {
      setIsMaximizedFlooring(!isMaximizedFlooring);
    };
    const toggleMaximizedColumn = () => {
      setIsMaximizedColumn(!isMaximizedColumn);
    };
    const toggleMaximizedBeam = () => {
      setIsMaximizedBeam(!isMaximizedBeam);
    };
    const toggleMaximizedWall = () => {
      setIsMaximizedWall(!isMaximizedWall);
    };
    const toggleMaximizedStair = () => {
      setIsMaximizedStair(!isMaximizedStair);
    };
    const toggleMaximizedCasettes = () => {
      setIsMaximizedCasettes(!isMaximizedCasettes);
    };
    const toggleMaximizedModules = () => {
      setIsMaximizedModules(!isMaximizedModules);
    };
    const toggleMaximizedCages = () => {
      setIsMaximizedCages(!isMaximizedCages);
    };
    const toggleMaximizedOther = () => {
      setIsMaximizedOther(!isMaximizedOther);
    };
    const toggleMaximizedInnovativeMaterials = () => {
      setIsMaximizedInnovativeMaterials(!isMaximizedInnovativeMaterials);
    };



  return (
    <div className="home">
      <div className='supplier-form'>
      <ViableSupplierForm cart={cart} products={products} suppliers={suppliers}/>
      </div>
      {/* <div className='viable-supplier'>
      <ViableSuppliers sitePostcode={sitePostcode} cart={cart} products={products} suppliers={suppliers}/>
      </div> */}
      <br/>
      <h3>Add products required from the below list:</h3>
      <div className="product-card">
        <h4 style={{ display: 'inline-block' }}>Flooring</h4>
        <button onClick={toggleMaximizedFlooring} style={{ float: 'right' }}>{isMaximizedFlooring ? "^" : "v"}</button>
        <br/>
        {isMaximizedFlooring && products && products.filter(product => product.component_type === 'Flooring').map((product) => (
          <ProductCard 
            key={product._id} 
            product={product}
            onAddToCart={handleAddToCart}
          />
        ))}
      </div>
      <div className="product-card">
        <h4 style={{ display: 'inline-block' }}>Column</h4>
        <button onClick={toggleMaximizedColumn} style={{ float: 'right' }}>{isMaximizedColumn ? "^" : "v"}</button>
        {isMaximizedColumn && products && products.filter(product => product.component_type === 'Column').map((product) => (
          <ProductCard 
            key={product._id} 
            product={product}
            onAddToCart={handleAddToCart}
          />
        ))}
      </div>
      <div className="product-card">
        <h4 style={{ display: 'inline-block' }}>Beam</h4>
        <button onClick={toggleMaximizedBeam} style={{ float: 'right' }}>{isMaximizedBeam ? "^" : "v"}</button>
        {isMaximizedBeam && products && products.filter(product => product.component_type === 'Beam').map((product) => (
          <ProductCard 
            key={product._id} 
            product={product}
            onAddToCart={handleAddToCart}
          />
        ))}
      </div>
      <div className="product-card">
        <h4 style={{ display: 'inline-block' }}>Wall</h4>
        <button onClick={toggleMaximizedWall} style={{ float: 'right' }}>{isMaximizedWall ? "^" : "v"}</button>
        {isMaximizedWall && products && products.filter(product => product.component_type === 'Wall').map((product) => (
          <ProductCard 
            key={product._id} 
            product={product}
            onAddToCart={handleAddToCart}
          />
        ))}
      </div>
      <div className="product-card">
        <h4 style={{ display: 'inline-block' }}>Stair</h4>
        <button onClick={toggleMaximizedStair} style={{ float: 'right' }}>{isMaximizedStair ? "^" : "v"}</button>
        {isMaximizedStair && products && products.filter(product => product.component_type === 'Stair').map((product) => (
          <ProductCard 
            key={product._id} 
            product={product}
            onAddToCart={handleAddToCart}
          />
        ))}
      </div>
      <div className="product-card">
        <h4 style={{ display: 'inline-block' }}>Casettes</h4>
        <button onClick={toggleMaximizedCasettes} style={{ float: 'right' }}>{isMaximizedCasettes ? "^" : "v"}</button>
        {isMaximizedCasettes && products && products.filter(product => product.component_type === 'Casettes').map((product) => (
          <ProductCard 
            key={product._id} 
            product={product}
            onAddToCart={handleAddToCart}
          />
        ))}
      </div>
      <div className="product-card">
        <h4 style={{ display: 'inline-block' }}>Modules</h4>
        <button onClick={toggleMaximizedModules} style={{ float: 'right' }}>{isMaximizedModules ? "^" : "v"}</button>
        {isMaximizedModules && products && products.filter(product => product.component_type === 'Modules').map((product) => (
          <ProductCard 
            key={product._id} 
            product={product}
            onAddToCart={handleAddToCart}
          />
        ))}
      </div>
      <div className="product-card">
        <h4 style={{ display: 'inline-block' }}>Cages</h4>
        <button onClick={toggleMaximizedCages} style={{ float: 'right' }}>{isMaximizedCages ? "^" : "v"}</button>
        {isMaximizedCages && products && products.filter(product => product.component_type === 'Cages').map((product) => (
          <ProductCard 
            key={product._id} 
            product={product}
            onAddToCart={handleAddToCart}
          />
        ))}
      </div>
      <div className="product-card">
        <h4 style={{ display: 'inline-block' }}>Other</h4>
        <button onClick={toggleMaximizedOther} style={{ float: 'right' }}>{isMaximizedOther ? "^" : "v"}</button>
        {isMaximizedOther && products && products.filter(product => product.component_type === 'Other').map((product) => (
          <ProductCard 
            key={product._id} 
            product={product}
            onAddToCart={handleAddToCart}
          />
        ))}
      </div>
      <div className="product-card">
        <h4 style={{ display: 'inline-block'}}>Innovative Materials</h4>
        <button onClick={toggleMaximizedInnovativeMaterials} style={{ float: 'right' }}>{isMaximizedInnovativeMaterials ? "^" : "v"}</button>
        {isMaximizedInnovativeMaterials && products && products.filter(product => product.component_type === 'Innovative Materials').map((product) => (
          <ProductCard 
            key={product._id} 
            product={product}
            onAddToCart={handleAddToCart}
          />
        ))}
      </div>
      {/* <div className="products">
        {suppliers && suppliers.map((supplier) => (
          <SupplierDetails key={supplier._id} supplier={supplier}/>
          ))}
      </div>
      <div className="products">
        {products && products.map((product) => (
          <ProductDetails key={product._id} product={product}/>
          ))}
      </div> */}
    </div>
  )
}

export default Home;