import { useState, useEffect } from "react"
import { useSuppliersContext } from "../hooks/useSuppliersContext.js";
import { useAuthContext } from "../hooks/useAuthContext.js"


const SupplierForm = ({cart}) => {
  const { dispatchSuppliers } = useSuppliersContext()
  const { user } = useAuthContext()

  const [name, setName] = useState('')
  const [postcode, setPostcode] = useState('')
  const [products, setProducts] = useState([])
  const [error, setError] = useState(null)
  const [emptyFields, setEmptyFields] = useState([])
  const [formSubmitted, setFormSubmitted] = useState(false);
  // const [cart, setCart] = useState([]);



  useEffect(() => {
    setProducts(cart);
  }, [cart]);

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormSubmitted(true);

    if (!user) {
      setError('You must be logged in')
      return
    }

    if (cart.length === 0) {
      setError('Please select at least one product.');
      return;
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

    // const clearCart = () => {
    //   // Clear the cart array
    //   setCart([]);
    // };

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
      // clearCart();
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
      <div className="cart">
      {/* <h4>Products List:</h4> */}
      <ul>
        {cart.map((product) => (
          <li key={product._id}>{product.component_name} ({product.component_type})</li>
        ))}
      </ul>
      </div>
      <input
        type="hidden"
        onChange={(e) => setProducts(e.target.value)}
        value={products}
        className={emptyFields.includes('products') ? 'error' : ''}
      />
      <button>Add Supplier</button>
      {error && <div className="error">{error}</div>}
      {/* {formSubmitted && cart.length === 0 && (<div className="error">Please select at least one product.</div> )} */}
      <h3>Add products from the below list:</h3>
    </form>
  )

}

export default SupplierForm;

