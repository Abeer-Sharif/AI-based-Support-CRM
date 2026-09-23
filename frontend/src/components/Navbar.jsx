import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Navbar() {
  const { session, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();

    navigate("/login", {
      replace: true
    });
  };

  return (
    <>
      {/* DESKTOP SIDEBAR */}
      <aside
        className="nav-rail"
        aria-label="Primary navigation"
      >
        <NavLink
          to="/"
          className="rail-logo"
          title="SupportDesk"
        >
          S
        </NavLink>

        <nav className="rail-links">

          {/* Tickets */}
          <NavLink
            to="/"
            className={({ isActive }) =>
              `rail-link ${
                isActive ? "active" : ""
              }`
            }
            title="Tickets"
          >
            <span>▤</span>

            <span className="rail-label">
              Tickets
            </span>
          </NavLink>


          {/* Create Ticket */}
          <NavLink
            to="/tickets/new"
            className={({ isActive }) =>
              `rail-link ${
                isActive ? "active" : ""
              }`
            }
            title="Create ticket"
          >
            <span>＋</span>

            <span className="rail-label">
              Create
            </span>
          </NavLink>


          {/* Admin Only */}
          {isAdmin && (
            <NavLink
              to="/agents"
              className={({ isActive }) =>
                `rail-link ${
                  isActive ? "active" : ""
                }`
              }
              title="Agents"
            >
              <span>👥</span>

              <span className="rail-label">
                Agents
              </span>
            </NavLink>
          )}

        </nav>


        {/* BOTTOM SECTION */}
        <div className="rail-bottom">

          <div
            className="rail-user"
            title={session?.email || ""}
          >
            {isAdmin ? "A" : "G"}
          </div>

          <button
            type="button"
            className="rail-link rail-button"
            onClick={handleLogout}
            title="Logout"
          >
            <span>↪</span>

            <span className="rail-label">
              Logout
            </span>
          </button>

        </div>
      </aside>


      {/* MOBILE NAVBAR */}
      <header className="mobile-nav">

        <NavLink
          to="/"
          className="mobile-brand"
        >
          SupportDesk
        </NavLink>

        <div className="mobile-nav-actions">

          {/* Admin Agents */}
          {isAdmin && (
            <NavLink
              to="/agents"
              className="mobile-new-ticket"
            >
              Agents
            </NavLink>
          )}

          {/* Create Ticket */}
          <NavLink
            to="/tickets/new"
            className="mobile-new-ticket"
          >
            + Ticket
          </NavLink>

          {/* Logout */}
          <button
            type="button"
            className="mobile-logout"
            onClick={handleLogout}
          >
            Logout
          </button>

        </div>

      </header>
    </>
  );
}