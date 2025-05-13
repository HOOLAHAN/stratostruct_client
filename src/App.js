import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuthContext } from "./hooks/useAuthContext";

// pages & components
import Home from './pages/Home';
import Navbar from "./components/Navbar";
import Admin from "./pages/Admin";

function ProtectedRoute({ role, allowedRoles, children }) {
  if (!role) {
    return <Navigate to="/" />;
  }

  if (allowedRoles.includes(role)) {
    return children;
  } else {
    return <Navigate to="/" />;
  }
}

function App() {
  const { user, loading } = useAuthContext();
  const role = user?.role;

  console.log('User from context:', user);

  if (loading) {
    return <div>Loading...</div>; 
  }

  return (
    <div className="App">
      <BrowserRouter>
        <Navbar />
        <div className="pages">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="/admin"
              element={
                <ProtectedRoute role={role} allowedRoles={['admin']}>
                  <Admin />
                </ProtectedRoute>
              }
            />
            <Route path="/*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
