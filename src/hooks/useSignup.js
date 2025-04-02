import { useState } from 'react';
import { useAuthContext } from './useAuthContext';

export const useSignup = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { dispatch } = useAuthContext();

  const signup = async (email, company, full_name, password, role) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(process.env.REACT_APP_BACKEND_API_URL + '/api/user/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, company, full_name, password, role })
      });

      const json = await response.json();

      if (!response.ok) {
        // Set the error message if signup fails
        const errorMessage = json.error || 'Signup failed. Please try again.';
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
      const errorMessage = 'An error occurred during signup. Please check your connection.';
      setError(errorMessage);
      setIsLoading(false);
      return { error: errorMessage };
    }
  };

  return { signup, isLoading, error };
};
