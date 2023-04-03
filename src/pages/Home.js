import { useEffect, useState } from "react";

// components
import ProductDetails from '../components/ProductDetails';
import SupplierDetails from "../components/SupplierDetails";

const Home = () => {
  const [products, setProducts] = useState(null)
  const [suppliers, setSuppliers] = useState(null)


  useEffect(() => {
  const fetchProducts = async () => {
    const response = await fetch('/api/products') //update endpoint for production
    const json = await response.json()

    if (response.ok) {
      setProducts(json)
    }
  }
  fetchProducts()
  }, [])

  useEffect(() => {
    const fetchSuppliers = async () => {
      const response = await fetch('/api/suppliers') //update endpoint for production
      const json = await response.json()
  
      if (response.ok) {
        setSuppliers(json)
      }
    }
    fetchSuppliers()
    }, [])

  return (
    <div className="home">
      <div className="products">
        {products && products.map((product) => (
          <ProductDetails key={product._id} product={product}/>
          ))}
      </div>
      <div className="products">
        {suppliers && suppliers.map((supplier) => (
          <SupplierDetails key={supplier._id} supplier={supplier}/>
          ))}
      </div>
    </div>
  )
}

export default Home;