import { useProductsContext } from "../hooks/useProductsContext"

const ProductDetails = ({ product }) => {
  const { dispatchProducts } = useProductsContext()

  const handleClickProduct = async () => {
    const response = await fetch('/api/products/' + product._id, {
      method: 'DELETE'
    })
    const json = await response.json()

    if (response.ok) {
      dispatchProducts({type: 'DELETE_PRODUCT', payload: json})
    }
  }

  return (
    <div className="product-details">
      <h4>Component Name: {product.component_name}</h4>
      <p><strong>Component Type: {product.component_type}</strong></p>
      <p><strong>Suppliers List: TBC</strong></p>
      <span className='material-symbols-outlined' onClick={handleClickProduct}>delete</span>
    </div>
  )
}

export default ProductDetails;