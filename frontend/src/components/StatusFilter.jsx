const statuses = ['All', 'Open', 'In Progress', 'Closed'];

export default function StatusFilter({ value, onChange }) {
  return (
    <select className="form-select" value={value} onChange={(event) => onChange(event.target.value)} aria-label="Filter tickets by status">
      {statuses.map((status) => <option key={status} value={status}>{status}</option>)}
    </select>
  );
}
