const SupplierDetails = ({ supplier }) => {
  return (
    <div className="product-details">
      <h4>Supplier Name: {supplier.name}</h4>
      <p><strong>Supplier Postcode: {supplier.postcode}</strong></p>
      <p><strong>Products List: TBC</strong></p>
      <p><strong>Added on: {supplier.createdAt}</strong></p>
    </div>
  )
}

export default SupplierDetails;