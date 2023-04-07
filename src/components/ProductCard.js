const ProductCard = ({ product, onAddToCart }) => {

  return (
    <div className="product-card">
      <h4 style={{ display: 'inline-block' }}>Component Name: </h4>
      <p style={{ display: 'inline-block', marginLeft: '5px' }}><strong>{product.component_name}</strong></p>
      <br/>
      <h4 style={{ display: 'inline-block' }}>Component Type:  </h4>
      <p style={{ display: 'inline-block', marginLeft: '5px' }}><strong>{product.component_type}</strong></p>
      <br/>
      <center><button onClick={() => onAddToCart(product)}>Add Product</button></center>
    </div>
  )
}

export default ProductCard;