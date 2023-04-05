import { useState } from "react"
import { useSuppliersContext } from "../hooks/useSuppliersContext.js";


const SupplierForm = () => {
  const { dispatchSuppliers } = useSuppliersContext()
  const [name, setName] = useState('')
  const [postcode, setPostcode] = useState('')
  const [products, setProducts] = useState([])
  const [error, setError] = useState(null)


  const handleSubmit = async (e) => {
    e.preventDefault()

    const supplier = {name, postcode, products}
    
    const response = await fetch('/api/suppliers', {
      method: 'POST',
      body: JSON.stringify(supplier),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    const json = await response.json()

    if (!response.ok) {
      setError(json.error)
    }
    if (response.ok) {
      setError(null)
      setName('')
      setPostcode('')
      setProducts([])
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
      />
      <label>Postcode:</label>
      <input
        type="text"
        onChange={(e) => setPostcode(e.target.value)}
        value={postcode}
      />
      <label>Products:</label>
      <input
        type="text"
        onChange={(e) => setProducts(e.target.value)}
        value={products}
      />
      <button>Add Supplier</button>
      {error && <div className="error">{error}</div>}
    </form>
  )

}

export default SupplierForm;

