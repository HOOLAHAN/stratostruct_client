import { createContext, useReducer, useEffect } from 'react';
import { isTokenExpired } from '../functions/isTokenExpired';

export const AuthContext = createContext();

export const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
      return {
        ...state,
        user: {
          email: action.payload.email,
          full_name: action.payload.full_name,
          token: action.payload.token,
          role: action.payload.role,
        },
      };
    case 'LOGOUT':
      return { ...state, user: null };
    case 'AUTH_READY':
      return { ...state, loading: false };
    default:
      return state;
  }
};

export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    loading: true,
  });

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));

    if (user && !isTokenExpired(user.token)) {
      dispatch({ type: 'LOGIN', payload: user });
    } else {
      dispatch({ type: 'LOGOUT' });
    }

    dispatch({ type: 'AUTH_READY' });
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};
