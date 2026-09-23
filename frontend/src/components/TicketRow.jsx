import { Link } from "react-router-dom";
import StatusBadge from "./StatusBadge.jsx";

function formatDate(value) {
  if (!value) return "—";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  }).format(date);
}

export default function TicketRow({ ticket }) {
  const ticketId =
    ticket.ticketId || ticket.ticket_id || "Unknown";

  const customer =
    ticket.customerName ||
    ticket.customer_name ||
    ticket.customerEmail ||
    ticket.customer_email ||
    "Unknown customer";

  const assignedAgent =
    ticket.assignedTo?.name ||
    ticket.assignedTo?.email ||
    "Unassigned";

  return (
    <tr>
      <td data-label="Ticket">
        <Link
          className="ticket-id"
          to={`/tickets/${encodeURIComponent(ticketId)}`}
        >
          {ticketId}
        </Link>
      </td>

      <td data-label="Customer">
        <div className="customer-cell">
          <strong>{customer}</strong>
          <span>
            {ticket.customerEmail ||
              ticket.customer_email ||
              ""}
          </span>
        </div>
      </td>

      <td data-label="Subject">
        <Link
          className="ticket-subject"
          to={`/tickets/${encodeURIComponent(ticketId)}`}
        >
          {ticket.subject || "No subject"}
        </Link>
      </td>

      <td data-label="Status">
        <StatusBadge
          value={ticket.status}
          type="status"
        />
      </td>

      <td data-label="Priority">
        <StatusBadge
          value={ticket.priority}
          type="priority"
        />
      </td>

      <td data-label="Sentiment">
        <StatusBadge
          value={ticket.sentiment}
          type="sentiment"
        />
      </td>

      <td data-label="Team">
        {ticket.team || "General"}
      </td>

      <td data-label="Assigned to">
        {assignedAgent}
      </td>

      <td data-label="Created">
        {formatDate(
          ticket.created_at ||
            ticket.createdAt
        )}
      </td>
    </tr>
  );
}
