import TicketRow from "./TicketRow.jsx";

export default function TicketTable({
  tickets,
  loading,
  error
}) {
  if (loading) {
    return (
      <div className="table-state">
        <div className="spinner" />
        <p>Loading tickets...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="table-state error-state">
        <strong>Could not load tickets</strong>
        <p>{error}</p>
      </div>
    );
  }

  if (!tickets.length) {
    return (
      <div className="table-state">
        <strong>No tickets found</strong>
        <p>
          Try changing the search or status filter.
        </p>
      </div>
    );
  }

  return (
    <div className="ticket-table-wrap">
      <table className="ticket-table">
        <thead>
          <tr>
            <th>Ticket</th>
            <th>Customer</th>
            <th>Subject</th>
            <th>Status</th>
            <th>Priority</th>
            <th>Sentiment</th>
            <th>Team</th>
            <th>Assigned to</th>
            <th>Created</th>
          </tr>
        </thead>

        <tbody>
    {tickets.map((ticket) => (
        <TicketRow
            key={ticket.ticket_id}
            ticket={ticket}
        />
    ))}
</tbody>
      </table>
    </div>
  );
}
