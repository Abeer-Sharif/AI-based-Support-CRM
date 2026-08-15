const styleByStatus = {
  Open: 'text-bg-primary',
  'In Progress': 'text-bg-warning',
  Closed: 'text-bg-success',
};

export default function StatusBadge({ status }) {
  return <span className={`badge rounded-pill status-badge ${styleByStatus[status] || 'text-bg-secondary'}`}>{status || 'Open'}</span>;
}
