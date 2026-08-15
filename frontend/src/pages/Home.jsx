import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import StatusFilter from '../components/StatusFilter';
import TicketTable from '../components/TicketTable';
import { ticketApi } from '../services/ticketApi';

export default function Home() {
  const [tickets, setTickets] = useState([]);
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadTickets = async () => {
    setLoading(true);
    setError('');
    try { setTickets(await ticketApi.getTickets()); } catch (err) { setError(err.message); } finally { setLoading(false); }
  };

  useEffect(() => { loadTickets(); }, []);

  const visibleTickets = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return tickets.filter((ticket) => {
      const matchesStatus = status === 'All' || ticket.status === status;
      const haystack = [ticket.ticket_id, ticket.customer_name, ticket.customer_email, ticket.subject, ticket.description].join(' ').toLowerCase();
      return matchesStatus && (!normalizedQuery || haystack.includes(normalizedQuery));
    });
  }, [tickets, query, status]);

  return (
    <section>
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div><p className="eyebrow mb-1">Support workspace</p><h1 className="h2 mb-0">Tickets</h1></div>
        <Link className="btn btn-primary" to="/create">Create ticket</Link>
      </div>
      <div className="filters mb-4">
        <SearchBar value={query} onChange={setQuery} />
        <StatusFilter value={status} onChange={setStatus} />
        {(query || status !== 'All') && <button type="button" className="btn btn-outline-secondary" onClick={() => { setQuery(''); setStatus('All'); }}>Clear</button>}
      </div>
      {error && <div className="alert alert-danger d-flex justify-content-between align-items-center" role="alert"><span>{error}</span><button className="btn btn-sm btn-outline-danger" onClick={loadTickets}>Retry</button></div>}
      {loading ? <div className="loading-state"><div className="spinner-border text-primary" role="status"><span className="visually-hidden">Loading tickets</span></div></div> : !error && <TicketTable tickets={visibleTickets} />}
    </section>
  );
}
