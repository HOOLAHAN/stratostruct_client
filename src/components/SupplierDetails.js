import { useSuppliersContext } from "../hooks/useSuppliersContext";

const SupplierDetails = ({ supplier }) => {
  const { dispatchSuppliers } = useSuppliersContext()
  
  const handleClickSupplier = async () => {
    const response = await fetch('/api/suppliers/' + supplier._id, {
      method: 'DELETE'
    })
    const json = await response.json()

    if (response.ok) {
      dispatchSuppliers({type: 'DELETE_SUPPLIER', payload: json})
    }
  }

  return (
    <div className="product-details">
      <h4>Supplier Name: {supplier.name}</h4>
      <p><strong>Supplier Postcode: {supplier.postcode}</strong></p>
      <p><strong>Products List: TBC</strong></p>
      <p><strong>Added on: {supplier.createdAt}</strong></p>
      <span onClick={handleClickSupplier}>delete</span>
    </div>
  )
}

export default SupplierDetails;