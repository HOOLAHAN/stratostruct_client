import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useLogout } from '../hooks/useLogout';
import { useAuthContext } from '../hooks/useAuthContext';
import SS_logo from "../images/SS_logo.svg";
import '../navbar.css'


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
            <button className="navbar-button small">Admin</button>
          </Link>
        );
      } else if (location.pathname === '/admin') {
        return (
          <Link to="/">
            <button className="navbar-button small">Home</button>
          </Link>
        );
      }
    }
    return null;
  };

  return (
    <header>
      <div className="container">
        <div className="logo-container">
          <Link to="/">
            <img src={SS_logo} alt="logo" className="logo" />
          </Link>
        </div>
        <nav>
          {user && (
            <div className="button-container">
              <div className="user-container">
              <span className="user-name">{user.full_name}</span>
              </div>
              <button className="navbar-button small" onClick={handleLogout}>Logout</button>
              {renderAdminButton()}
            </div>
          )}
          {!user && (
            <div className="button-container">
              <div>
                <Link to="/login">Login</Link>
                <Link to="/signup">Signup</Link>
              </div>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
