import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useLogout } from '../hooks/useLogout';
import { useAuthContext } from '../hooks/useAuthContext';

const Navbar = () => {
  const { logout } = useLogout();
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    if (location.pathname.startsWith('/admin')) {
      navigate('/login');
    }
  };

  const renderAdminButton = () => {
    if (user && user.role === 'admin') {
      if (location.pathname === '/') {
        return (
          <Link to="/admin">
            <button>Admin</button>
          </Link>
        );
      } else if (location.pathname === '/admin') {
        return (
          <Link to="/">
            <button>Home</button>
          </Link>
        );
      }
    }
    return null;
  };

  return (
    <header>
      <div className="container">
        <Link to="/">
          <h1>StratoStruct</h1>
        </Link>
        <nav>
          {user && (
            <div>
              <span>{user.full_name}</span>
              <button onClick={handleLogout}>Log out</button>
              {renderAdminButton()}
            </div>
          )}
          {!user && (
            <div>
              <Link to="/login">Login</Link>
              <Link to="/signup">Signup</Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
