import { useEffect, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import NoteList from '../components/NoteList';
import StatusBadge from '../components/StatusBadge';
import { ticketApi } from '../services/ticketApi';

const statuses = ['Open', 'In Progress', 'Closed'];

export default function TicketDetails() {
  const { id } = useParams();
  const location = useLocation();
  const [ticket, setTicket] = useState(null);
  const [status, setStatus] = useState('Open');
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(true);
  const [savingStatus, setSavingStatus] = useState(false);
  const [savingNote, setSavingNote] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState(location.state?.message || '');

  const loadTicket = async () => {
    setLoading(true); setError('');
    try { const data = await ticketApi.getTicket(id); setTicket(data); setStatus(data.status); } catch (err) { setError(err.message); } finally { setLoading(false); }
  };
  useEffect(() => { loadTicket(); }, [id]);

  const saveStatus = async () => {
    setSavingStatus(true); setError(''); setNotice('');
    try { await ticketApi.updateTicket(id, { status }); setTicket((current) => ({ ...current, status })); setNotice('Status updated.'); } catch (err) { setError(err.message); } finally { setSavingStatus(false); }
  };
  const addNote = async (event) => {
    event.preventDefault();
    const noteText = note.trim();
    if (!noteText) return;
    setSavingNote(true); setError(''); setNotice('');
    try { await ticketApi.addNote(id, noteText); setNote(''); await loadTicket(); setNotice('Note added.'); } catch (err) { setError(err.message); } finally { setSavingNote(false); }
  };

  if (loading) return <div className="loading-state"><div className="spinner-border text-primary" role="status"><span className="visually-hidden">Loading ticket</span></div></div>;
  if (error && !ticket) return <div className="alert alert-danger">{error} <button className="btn btn-sm btn-outline-danger ms-2" onClick={loadTicket}>Retry</button></div>;

  return <section>
    <Link className="back-link" to="/">Back to tickets</Link>
    {notice && <div className="alert alert-success mt-3" role="status">{notice}</div>}
    {error && <div className="alert alert-danger mt-3" role="alert">{error}</div>}
    <div className="ticket-header mt-3 mb-4"><div><p className="eyebrow mb-1">{ticket.ticket_id}</p><h1 className="h2 mb-2">{ticket.subject}</h1><StatusBadge status={ticket.status} /></div></div>
    <div className="row g-4">
      <div className="col-lg-7">
        <div className="content-panel mb-4"><h2 className="h5">Customer request</h2><p className="preserve-lines mb-0">{ticket.description}</p></div>
        <div className="content-panel"><h2 className="h5 mb-3">Notes</h2><NoteList notes={ticket.notes} /><hr className="my-4" /><form onSubmit={addNote}><label className="form-label" htmlFor="note">Add a note</label><textarea className="form-control" id="note" rows="3" value={note} onChange={(event) => setNote(event.target.value)} placeholder="Add an internal update" required /><button className="btn btn-primary mt-3" disabled={savingNote} type="submit">{savingNote ? 'Adding...' : 'Add note'}</button></form></div>
      </div>
      <aside className="col-lg-5"><div className="content-panel mb-4"><h2 className="h5 mb-3">AI Triage</h2><dl className="detail-list"><div><dt>Category</dt><dd>{ticket.category ? <span className="badge rounded-pill triage-category">{ticket.category}</span> : <span className="text-secondary">Not available</span>}</dd></div><div><dt>Priority</dt><dd>{ticket.priority ? <span className={`badge rounded-pill triage-priority priority-${ticket.priority.toLowerCase()}`}>{ticket.priority}</span> : <span className="text-secondary">Not available</span>}</dd></div><div><dt>Sentiment</dt><dd>{ticket.sentiment ? <span className={`badge rounded-pill triage-sentiment sentiment-${ticket.sentiment.toLowerCase()}`}>{ticket.sentiment}</span> : <span className="text-secondary">Not available</span>}</dd></div></dl></div><div className="content-panel"><h2 className="h5 mb-3">Ticket details</h2><dl className="detail-list"><div><dt>Customer</dt><dd>{ticket.customer_name}</dd></div><div><dt>Email</dt><dd><a href={`mailto:${ticket.customer_email}`}>{ticket.customer_email}</a></dd></div></dl><hr /><label className="form-label" htmlFor="status">Status</label><div className="d-flex gap-2"><select className="form-select" id="status" value={status} onChange={(event) => setStatus(event.target.value)}>{statuses.map((item) => <option key={item}>{item}</option>)}</select><button className="btn btn-outline-primary text-nowrap" onClick={saveStatus} disabled={savingStatus}>{savingStatus ? 'Saving...' : 'Save'}</button></div></div></aside>
    </div>
  </section>;
}
