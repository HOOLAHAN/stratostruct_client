import { useEffect } from "react";
import { useSuppliersContext } from "../hooks/useSuppliersContext";
import { useProductsContext } from "../hooks/useProductsContext"

// components
import ProductDetails from '../components/ProductDetails';
import ProductForm from "../components/ProductForm.js";
import SupplierDetails from "../components/SupplierDetails";
import SupplierForm from "../components/SupplierForm";

const Home = () => {
  const { suppliers, dispatchSuppliers } = useSuppliersContext()
  const { products, dispatchProducts } = useProductsContext()

  useEffect(() => {
  const fetchProducts = async () => {
    const response = await fetch('/api/products') //update endpoint for production
    const json = await response.json()

    if (response.ok) {
      dispatchProducts({type: 'SET_PRODUCTS', payload: json})
    }
  }
  fetchProducts()
  }, [dispatchProducts])

  useEffect(() => {
    const fetchSuppliers = async () => {
      const response = await fetch('/api/suppliers') //update endpoint for production
      const json = await response.json()
  
      if (response.ok) {
        dispatchSuppliers({type: 'SET_SUPPLIERS', payload: json})
      }
    }
    fetchSuppliers()
    }, [dispatchSuppliers])

  return (
    <div className="home">
      <SupplierForm />
      <ProductForm />
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