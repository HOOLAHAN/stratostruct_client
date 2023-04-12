const StockistCard = ({ item }) => {

  return (
    <div className="product-card">
      <h4 style={{ display: 'inline-block' }}>Component Name: </h4>
      <p style={{ display: 'inline-block', marginLeft: '5px' }}><strong>{item.component_name}</strong></p>
      <br/>
      <h4 style={{ display: 'inline-block' }}>Component Type:  </h4>
      <p style={{ display: 'inline-block', marginLeft: '5px' }}><strong>{item.component_type}</strong></p>
      <br/>
      <h4 style={{ display: 'inline-block' }}>Stockists:  </h4>
      {item.stockists && item.stockists.map((stockistItem) => (
        <p style={{ display: 'inline-block', marginLeft: '5px' }} key={stockistItem._id}><strong>
          {stockistItem.name}, 
          </strong></p>
      ))}
      <br/>
    </div>
  )
}

export default StockistCard;