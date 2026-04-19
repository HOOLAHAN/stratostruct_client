import { useState } from 'react';
import { useAuthContext } from './useAuthContext';
import { apiFetch } from '../functions/apiClient';

export const useLogin = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { dispatch } = useAuthContext();

  const login = async (email, password) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await apiFetch('/api/user/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const json = await response.json();

      if (!response.ok) {
        // Set the error message if login fails
        const errorMessage = json.error || 'Login failed. Please try again.';
        setError(errorMessage);
        setIsLoading(false);
        return { error: errorMessage };
      }

      // Save the user to local storage
      localStorage.setItem('user', JSON.stringify(json));

      // Update the auth context
      dispatch({ type: 'LOGIN', payload: json });

      setIsLoading(false);
      return { success: true };
    } catch (error) {
      // Handle unexpected errors (e.g., network issues)
      const errorMessage = 'An error occurred during login. Please check your connection.';
      setError(errorMessage);
      setIsLoading(false);
      return { error: errorMessage };
    }
  };

  return { login, isLoading, error };
};
