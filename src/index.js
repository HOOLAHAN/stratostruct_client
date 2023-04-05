import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { SuppliersContextProvider } from './context/SuppliersContext';
import { ProductsContextProvider } from './context/ProductsContext';
import { AuthContextProvider } from './context/AuthContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthContextProvider>
      <SuppliersContextProvider>
        <ProductsContextProvider>
          <App />
        </ProductsContextProvider>
      </SuppliersContextProvider>
    </AuthContextProvider>
  </React.StrictMode>
);
