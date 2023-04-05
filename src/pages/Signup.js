import { useState } from "react"
import { useSignup } from "../hooks/useSignup"

const Signup = () => {

  const [email, setEmail] = useState('')
  const [company, setCompany] = useState('')
  const [full_name, setFullName] = useState('')
  const [password, setPassword] = useState('')
  const {signup, error, isLoading} = useSignup()


  const handleSubmit = async (e) => {
    e.preventDefault()

    await signup(email, company, full_name, password)
  }

  return (
    <form className='signup' onSubmit={handleSubmit}>
      <h3>Sign up</h3>
      <label>Email:</label>
      <input
        type='email'
        onChange={(e) => setEmail(e.target.value)}
        value={email}
      />
      <label>Company:</label>
      <input
        type='company'
        onChange={(e) => setCompany(e.target.value)}
        value={company}
      />
      <label>Full Name:</label>
      <input
        type='full_name'
        onChange={(e) => setFullName(e.target.value)}
        value={full_name}
      />
      <label>Password:</label>
      <input
        type='password'
        onChange={(e) => setPassword(e.target.value)}
        value={password}
      />            
      <button disabled={isLoading}>Sign up</button>
      {error && <div className="error">{error}</div>}
    </form>
  )

}

export default Signup;