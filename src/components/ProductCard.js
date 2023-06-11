const ProductCard = ({ product, cart, onAddToCart, onRemoveFromCart }) => {
  const isInCart = cart.find((item) => item._id === product._id);

  const handleClick = () => {
    if (isInCart) {
      onRemoveFromCart(product);
    } else {
      onAddToCart(product);
    }
  };

  return (
    <button
      className={`product-card ${isInCart ? 'selected' : ''}`}
      onClick={handleClick}
      style={{ background: isInCart ? '#DEFFF2' : 'none' }}
    >
      <p style={{ display: 'inline-block', marginLeft: '5px' }}>
        <strong>{product.component_name}</strong>
      </p>
      <br />
    </button>
  );
};

export default ProductCard;
