const ProductDetails = ({ product }) => {
  return (
    <div className="product-details">
      <h4>Component Name: {product.component_name}</h4>
      <p><strong>Component Type: {product.component_type}</strong></p>
      <p><strong>Suppliers List: TBC</strong></p>
    </div>
  )
}

export default ProductDetails;