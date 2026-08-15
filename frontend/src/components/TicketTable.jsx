import TicketRow from './TicketRow';

export default function TicketTable({ tickets }) {
  if (!tickets.length) {
    return <div className="empty-state"><h2>No tickets found</h2><p className="mb-0">Try a different search or create a new support ticket.</p></div>;
  }

  return (
    <div className="table-responsive border rounded-3 bg-white">
      <table className="table table-hover align-middle mb-0">
        <thead><tr><th>ID</th><th>Customer</th><th>Issue</th><th>Status</th><th>Priority</th><th>Created</th></tr></thead>
        <tbody>{tickets.map((ticket) => <TicketRow key={ticket.ticket_id} ticket={ticket} />)}</tbody>
      </table>
    </div>
  );
}
