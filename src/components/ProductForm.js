import { useState } from "react"
import { useProductsContext } from "../hooks/useProductsContext.js"
import { useAuthContext } from "../hooks/useAuthContext.js"

const ProductForm = () => {
  const { dispatchProducts } = useProductsContext()
  const { user } = useAuthContext()

  const [component_type, setComponentType] = useState('')
  const [component_name, setComponentName] = useState('')
  const [error, setError] = useState(null)
  const [emptyFields, setEmptyFields] = useState([])

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!user) {
      setError('You must be logged in')
      return
    }

    const product = {component_type, component_name}
    
    const response = await fetch('/api/products', {
      method: 'POST',
      body: JSON.stringify(product),
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
      setComponentType('')
      setComponentName('')
      setEmptyFields([])
      console.log("New Product Added", json)
      dispatchProducts({type: 'CREATE_PRODUCT', payload: json})
    }
  }

  return (
    <form className="create" onSubmit={handleSubmit}>
      <h3>Add a Product</h3>
      <label>Component Type:</label>
      <select
        onChange={(e) => setComponentType(e.target.value)}
        value={component_type}
        className={emptyFields.includes('component_type') ? 'error' : ''}
        style={{
          padding: '10px',
          marginTop: '10px',
          marginBottom: '20px',
          width: '100%',
          border: '1px solid #ddd',
          borderRadius: '4px',
          boxSizing: 'border-box',
        }}
      >
        <option value="">Select Component Type</option>
        <option value="Flooring">Flooring</option>
        <option value="Column">Column</option>
        <option value="Beam">Beam</option>
        <option value="Wall">Wall</option>
        <option value="Stair">Stair</option>
        <option value="Casettes">Casettes</option>
        <option value="Modules">Modules</option>
        <option value="Cages">Cages</option>
        <option value="Other">Other</option>
        <option value="Innovative Materials">Innovative Materials</option>
      </select>
      <label>Component Name:</label>
      <input
        type="text"
        onChange={(e) => setComponentName(e.target.value)}
        value={component_name}
        className={emptyFields.includes('component_name') ? 'error' : ''}
      />
      <button>Add Product</button>
      {error && <div className="error">{error}</div>}
    </form>
  )

}

export default ProductForm;

