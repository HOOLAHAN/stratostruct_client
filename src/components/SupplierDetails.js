import { useSuppliersContext } from "../hooks/useSuppliersContext";
import formatDistanceToNow from 'date-fns/formatDistanceToNow'
import { useAuthContext } from "../hooks/useAuthContext.js"

const SupplierDetails = ({ supplier }) => {
  const { dispatchSuppliers } = useSuppliersContext()
  const { user } = useAuthContext()
  
  const handleClickSupplier = async () => {
    if (!user) {
      return
    }
    const response = await fetch('/api/suppliers/' + supplier._id, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${user.token}`
      }
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
      <p><strong>Added: {formatDistanceToNow(new Date(supplier.createdAt), {addSuffix: true})}</strong></p>
      <span className='material-symbols-outlined' onClick={handleClickSupplier}>delete</span>
    </div>
  )
}

export default SupplierDetails;