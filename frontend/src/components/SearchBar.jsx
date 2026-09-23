export default function SearchBar({
  value,
  onChange
}) {
  return (
    <div className="search-wrap">
      <span className="search-icon" aria-hidden="true">
        ⌕
      </span>

      <input
        className="search-input"
        type="search"
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        placeholder="Search tickets, customers, subjects..."
        aria-label="Search tickets"
      />
    </div>
  );
}
