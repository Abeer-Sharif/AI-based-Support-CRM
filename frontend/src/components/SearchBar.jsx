export default function SearchBar({ value, onChange }) {
  return (
    <div className="input-group">
      <span className="input-group-text bg-white">Search</span>
      <input
        className="form-control"
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Name, email, ID, title, or description"
        aria-label="Search tickets"
      />
    </div>
  );
}
