const ProductCard = ({ product, onAddToCart }) => {

  return (
    <div 
    className="product-card" 
    >
      <h3 
      style={{ display: 'inline-block' }}
      >Component Name: </h3>
      <p 
      style={{ display: 'inline-block', marginLeft: '5px' }}
      ><strong>{product.component_name}</strong></p>
      <br/>
      <h3 
      style={{ display: 'inline-block' }}
      >Component Type:  </h3>
      <p 
      style={{ display: 'inline-block', marginLeft: '5px' }}
      ><strong>{product.component_type}</strong></p>
      <button 
      onClick={() => onAddToCart(product)}
      >Add Product</button>
    </div>
  )
}

export default ProductCard;