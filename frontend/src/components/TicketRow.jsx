import { Link } from 'react-router-dom';
import StatusBadge from './StatusBadge';

const formatDate = (date) => date ? new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' }).format(new Date(date)) : '-';

export default function TicketRow({ ticket }) {
  return (
    <tr>
      <td><Link className="ticket-id" to={`/tickets/${encodeURIComponent(ticket.ticket_id)}`}>{ticket.ticket_id}</Link></td>
      <td>{ticket.customer_name}</td>
      <td><Link className="ticket-subject" to={`/tickets/${encodeURIComponent(ticket.ticket_id)}`}>{ticket.subject}</Link></td>
      <td><StatusBadge status={ticket.status} /></td>
      <td>{ticket.priority ? <span className={`badge rounded-pill triage-priority priority-${ticket.priority.toLowerCase()}`}>{ticket.priority}</span> : <span className="text-secondary">-</span>}</td>
      <td className="text-nowrap text-secondary">{formatDate(ticket.created_at)}</td>
    </tr>
  );
}
