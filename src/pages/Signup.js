import { useState } from "react"

const Signup = () => {

  const [email, setEmail] = useState('')
  const [company, setCompany] = useState('')
  const [full_name, setFullName] = useState('')
  const [password, setPassword] = useState('')


  const handleSubmit = async (e) => {
    e.preventDefault()

    console.log(email, password)
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
      <button>Sign up</button>
    </form>
  )

}

export default Signup;