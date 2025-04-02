import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuthContext } from "./hooks/useAuthContext";

// pages & components
import Home from './pages/Home';
import Navbar from "./components/Navbar";
import Admin from "./pages/Admin";

function ProtectedRoute({ role, allowedRoles, element: Element }) {
  if (!role) {
    return <Navigate to="/" />; 
  }

  if (allowedRoles.includes(role)) {
    return <Element />;
  } else {
    return <Navigate to="/" />;
  }
}

function App() {
  const { user } = useAuthContext();
  const [role, setRole] = useState(user ? user.role : null);

  useEffect(() => {
    if (user && !role) {
      setRole(user.role);
    }
  }, [user, role]);

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
                <ProtectedRoute
                  role={role}
                  allowedRoles={['admin']}
                  element={Admin}
                />
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
