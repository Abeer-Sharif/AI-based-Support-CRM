const normalize = (value = "") =>
  value.toLowerCase().replace(/\s+/g, "-");

export default function StatusBadge({
  value,
  type = "status"
}) {
  if (!value) {
    return <span className="badge badge-muted">—</span>;
  }

  return (
    <span
      className={`badge badge-${type} ${type}-${normalize(value)}`}
    >
      {value}
    </span>
  );
}
