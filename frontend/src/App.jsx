import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
  useLocation
} from "react-router-dom";

import { useAuth } from "./context/AuthContext.jsx";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import CreateTicket from "./pages/CreateTicket.jsx";
import TicketDetails from "./pages/TicketDetails.jsx";
import Agents from "./pages/Agents.jsx";

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location.pathname }}
      />
    );
  }

  return children;
}
function AdminRoute({ children }) {
    const {
        isAuthenticated,
        isAdmin
    } = useAuth();

    if (!isAuthenticated) {
        return (
            <Navigate
                to="/login"
                replace
            />
        );
    }

    if (!isAdmin) {
        return (
            <Navigate
                to="/"
                replace
            />
        );
    }

    return children;
}

function GuestRoute({ children }) {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
}

const router = createBrowserRouter([
    {
        path: "/login",
        element: (
            <GuestRoute>
                <Login />
            </GuestRoute>
        )
    },

    {
        path: "/register",
        element: (
            <GuestRoute>
                <Register />
            </GuestRoute>
        )
    },

    {
        path: "/",
        element: (
            <ProtectedRoute>
                <Home />
            </ProtectedRoute>
        )
    },

    {
        path: "/tickets/new",
        element: (
            <ProtectedRoute>
                <CreateTicket />
            </ProtectedRoute>
        )
    },

    {
        path: "/tickets/:ticketId",
        element: (
            <ProtectedRoute>
                <TicketDetails />
            </ProtectedRoute>
        )
    },

    {
        path: "/agents",
        element: (
            <AdminRoute>
                <Agents />
            </AdminRoute>
        )
    }
]);

export default function App() {
  return <RouterProvider router={router} />;
}
