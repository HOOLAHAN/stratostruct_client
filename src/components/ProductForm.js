import { useState } from "react"
import { useProductsContext } from "../hooks/useProductsContext.js"


const ProductForm = () => {
  const { dispatchProducts } = useProductsContext()
  const [component_type, setComponentType] = useState('')
  const [component_name, setComponentName] = useState('')
  const [error, setError] = useState(null)
  const [emptyFields, setEmptyFields] = useState([])

  const handleSubmit = async (e) => {
    e.preventDefault()

    const product = {component_type, component_name}
    
    const response = await fetch('/api/products', {
      method: 'POST',
      body: JSON.stringify(product),
      headers: {
        'Content-Type': 'application/json'
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
      <input
        type="text"
        onChange={(e) => setComponentType(e.target.value)}
        value={component_type}
        className={emptyFields.includes('component_type') ? 'error' : ''}
      />
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

