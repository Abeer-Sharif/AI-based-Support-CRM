function formatDate(value) {
  if (!value) return "";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(date);
}

export default function NoteList({ notes = [] }) {
  if (!notes.length) {
    return (
      <div className="empty-notes">
        No internal notes yet.
      </div>
    );
  }

  return (
    <div className="note-list">
      {notes.map((note, index) => (
        <article
          className="note-item"
          key={note._id || `${index}-${note.created_at}`}
        >
          <p>
            {note.noteText ||
              note.notes ||
              note.text ||
              ""}
          </p>

          <time>
            {formatDate(
              note.created_at ||
                note.createdAt
            )}
          </time>
        </article>
      ))}
    </div>
  );
}
