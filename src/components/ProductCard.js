const ProductCard = ({ product, onAddToCart, onRemoveFromCart }) => {

  const handleAddToCart = () => {
    onAddToCart(product);
  }

  const handleRemoveFromCart = () => {
    onRemoveFromCart(product);
  }

  return (
    <div className="product-card">
      <h3 style={{ display: 'inline-block' }}>Component Name: </h3>
      <p style={{ display: 'inline-block', marginLeft: '5px' }}><strong>{product.component_name}</strong></p>
      <br/>
      <h3 style={{ display: 'inline-block' }}>Component Type:  </h3>
      <p style={{ display: 'inline-block', marginLeft: '5px' }}><strong>{product.component_type}</strong></p>
      <button onClick={handleAddToCart}>Add Product</button>
      <button onClick={handleRemoveFromCart}>Remove Product</button>
    </div>
  );
}

export default ProductCard;