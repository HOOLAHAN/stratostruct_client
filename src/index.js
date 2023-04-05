import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { SuppliersContextProvider } from './context/SuppliersContext';
import { ProductsContextProvider } from './context/ProductsContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <SuppliersContextProvider>
    <ProductsContextProvider>
      <App />
    </ProductsContextProvider>
    </SuppliersContextProvider>
  </React.StrictMode>
);
