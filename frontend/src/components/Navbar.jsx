import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AppNavbar() {
  const { isAuthenticated, session, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-sm navbar-dark app-navbar">
      <div className="container">
        <NavLink className="navbar-brand fw-semibold" to="/">SupportDesk</NavLink>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mainNav" aria-controls="mainNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse" id="mainNav">
          <div className="navbar-nav ms-auto align-items-sm-center gap-sm-2">
            <NavLink end className="nav-link" to="/">Tickets</NavLink>
            {isAuthenticated ? <>
              <span className="navbar-text account-indicator mt-2 mt-sm-0">{session.email}</span>
              <button className="btn btn-outline-light btn-sm px-3" type="button" onClick={handleLogout}>Logout</button>
            </> : <>
              <NavLink className="nav-link" to="/login">Login</NavLink>
              <NavLink className="nav-link" to="/register">Register</NavLink>
            </>}
          </div>
        </div>
      </div>
    </nav>
  );
}
