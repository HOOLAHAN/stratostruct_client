import { useState } from "react"
import { useSuppliersContext } from "../hooks/useSuppliersContext.js";
import { useAuthContext } from "../hooks/useAuthContext.js"


const SupplierForm = () => {
  const { dispatchSuppliers } = useSuppliersContext()
  const { user } = useAuthContext()

  const [name, setName] = useState('')
  const [postcode, setPostcode] = useState('')
  const [products, setProducts] = useState([])
  const [error, setError] = useState(null)
  const [emptyFields, setEmptyFields] = useState([])

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!user) {
      setError('You must be logged in')
      return
    }

    const supplier = {name, postcode, products}
    
    const response = await fetch('/api/suppliers', {
      method: 'POST',
      body: JSON.stringify(supplier),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${user.token}`
      }
    })
    const json = await response.json()

    if (!response.ok) {
      setError(json.error)
      setEmptyFields(json.emptyFields)
    }
    if (response.ok) {
      setError(null)
      setName('')
      setPostcode('')
      setProducts([])
      setEmptyFields([])
      console.log("New Supplier Added", json)
      dispatchSuppliers({type: 'CREATE_SUPPLIER', payload: json})
    }
  }

  return (
    <form className="create" onSubmit={handleSubmit}>
      <h3>Add a supplier</h3>
      <label>Name:</label>
      <input
        type="text"
        onChange={(e) => setName(e.target.value)}
        value={name}
        className={emptyFields.includes('name') ? 'error' : ''}
      />
      <label>Postcode:</label>
      <input
        type="text"
        onChange={(e) => setPostcode(e.target.value)}
        value={postcode}
        className={emptyFields.includes('postcode') ? 'error' : ''}
      />
      <label>Products:</label>
      <input
        type="text"
        onChange={(e) => setProducts(e.target.value)}
        value={products}
        className={emptyFields.includes('products') ? 'error' : ''}
      />
      <button>Add Supplier</button>
      {error && <div className="error">{error}</div>}
    </form>
  )

}

export default SupplierForm;

