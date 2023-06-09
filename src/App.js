// import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
// import { useAuthContext } from "./hooks/useAuthContext";
// import React, { useState } from "react";

// // pages & components
// import Home from './pages/Home';
// import Navbar from "./components/Navbar";
// import Login from "./pages/Login";
// import Signup from "./pages/Signup";
// import Admin from "./pages/Admin";

// function App() {
//   const { user } = useAuthContext();

//   const [role, setRole] = useState(user ? user.role : null);

//   if (user && !role) {
//     setRole(user.role);
//   }

//   console.log(role)

//   return (
//     <div className="App">
//       <BrowserRouter>
//         <Navbar />
//         <div className="pages">
//           <Routes>
//             <Route
//             path="/"
//             element={user ? <Home /> : <Navigate to="/login" />}
//             />
//             <Route
//             path="/admin"
//             element={ role === "admin" ? <Admin /> : <Navigate to="/" />}
//             />
//             <Route
//             path="/login"
//             element={!user ? <Login /> : <Navigate to="/" />}
//             />
//             <Route
//             path="/signup"
//             element={!user ? <Signup /> : <Navigate to="/" />}
//             />
//           </Routes>
//         </div>
//       </BrowserRouter>
//     </div>
//   );
  
// }

// export default App;

// {/* <Route
// path="/admin"
// element={<Admin />}
// /> */}

import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuthContext } from "./hooks/useAuthContext";

// pages & components
import Home from './pages/Home';
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Admin from "./pages/Admin";

function ProtectedRoute({ role, allowedRoles, element: Element }) {
  if (!role) {
    return null;
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

  console.log(role);

  return (
    <div className="App">
      <BrowserRouter>
        <Navbar />
        <div className="pages">
          <Routes>
            <Route
              path="/"
              element={user ? <Home /> : <Navigate to="/login" />}
            />
            <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
            <Route path="/signup" element={!user ? <Signup /> : <Navigate to="/" />} />
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
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}


export default App;