const options = [
  { label: "All tickets", value: "" },
  { label: "Open", value: "Open" },
  { label: "In progress", value: "In Progress" },
  { label: "Closed", value: "Closed" }
];

export default function StatusFilter({
  value,
  onChange
}) {
  return (
    <select
      className="status-select"
      value={value}
      onChange={(event) =>
        onChange(event.target.value)
      }
      aria-label="Filter tickets by status"
    >
      {options.map((option) => (
        <option
          key={option.label}
          value={option.value}
        >
          {option.label}
        </option>
      ))}
    </select>
  );
}
