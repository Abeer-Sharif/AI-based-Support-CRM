import { Route, Routes } from 'react-router-dom';
import AppNavbar from './components/Navbar';
import Home from './pages/Home';
import CreateTicket from './pages/CreateTicket';
import TicketDetails from './pages/TicketDetails';
import Login from './pages/Login';
import Register from './pages/Register';

export default function App() {
  return (
    <div className="app-shell">
      <AppNavbar />
      <main className="container py-4 py-lg-5">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/create" element={<CreateTicket />} />
          <Route path="/tickets/:id" element={<TicketDetails />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </main>
    </div>
  );
}
