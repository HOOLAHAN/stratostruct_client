import { createContext, useReducer, useEffect } from 'react'
import { isTokenExpired } from '../functions/isTokenExpired'

export const AuthContext = createContext()

export const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN': 
    return {
      user: {
        email: action.payload.email,
        full_name: action.payload.full_name,
        token: action.payload.token,
        role: action.payload.role,
      },
    }
    case 'LOGOUT':
      return { user: null }
    default:
      return state
  }
}

export const AuthContextProvider = ({children}) => {
  const [state, dispatch] = useReducer(authReducer, {
    user: null
  })

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'))

    if (user) {
      // Check if the token has expired
      if (isTokenExpired(user.token)) {
        console.log('Expired token')
        dispatch({ type: 'LOGOUT' }); // Token is expired, log the user out
      } else {
        dispatch({ type: 'LOGIN', payload: user }); // Token is valid, log the user in
      }
    }
  }, [])

  // console.log('AuthContext state: ', state)

  return (
    <AuthContext.Provider value={{...state, dispatch}}>
      { children }
    </AuthContext.Provider>
  )
}