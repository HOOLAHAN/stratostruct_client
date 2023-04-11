import { useEffect } from "react";
import { useSuppliersContext } from "../hooks/useSuppliersContext";
import { useProductsContext } from "../hooks/useProductsContext";
import { useAuthContext } from '../hooks/useAuthContext';

// components
import ProductDetails from '../components/ProductDetails';
import SupplierDetails from "../components/SupplierDetails";

const Home = () => {
  const { suppliers, dispatchSuppliers } = useSuppliersContext()
  const { products, dispatchProducts } = useProductsContext()
  const { user } = useAuthContext()

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

  return (
    <div className="home">
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
    </div>
  )
}

export default Home;