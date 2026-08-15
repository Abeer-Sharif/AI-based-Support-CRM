const formatDateTime = (date) => date ? new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(date)) : '';

export default function NoteList({ notes = [] }) {
  if (!notes.length) return <p className="text-secondary mb-0">No notes have been added yet.</p>;
  return (
    <div className="vstack gap-3">
      {notes.map((note) => (
        <article className="note-item" key={note._id || `${note.noteText}-${note.created_at}`}>
          <p className="mb-2 text-break">{note.noteText}</p>
          <small className="text-secondary">{formatDateTime(note.created_at)}</small>
        </article>
      ))}
    </div>
  );
}
