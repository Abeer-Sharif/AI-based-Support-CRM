import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";

import Navbar from "../components/Navbar.jsx";
import NoteList from "../components/NoteList.jsx";
import StatusBadge from "../components/StatusBadge.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { ticketApi } from "../services/ticketApi.js";
import { userApi } from "../services/userApi.js";
import "./Ticket.css";

const STATUSES = [
  "Open",
  "In Progress",
  "Closed"
];

function formatDate(value) {
  if (!value) return "—";
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(date);
}

export default function TicketDetails() {
  const { ticketId } = useParams();
  const { isAdmin } = useAuth();

  const [ticket, setTicket] = useState(null);
  const [notes, setNotes] = useState([]);
  const [agents, setAgents] = useState([]);
  const [noteText, setNoteText] = useState("");
  const [status, setStatus] = useState("Open");
  const [assignedTo, setAssignedTo] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const loadTicket = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const data = await ticketApi.getTicket(ticketId);
      const ticketData = data.ticket || data;

      setTicket(ticketData);
      setNotes(data.notes || ticketData.notes || []);
      setStatus(ticketData.status || "Open");
      setAssignedTo(ticketData.assignedTo?._id || "");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [ticketId]);

  useEffect(() => {
    loadTicket();
  }, [loadTicket]);

  useEffect(() => {
    if (!isAdmin || !ticket?.team) {
      return;
    }

    userApi
      .getAgents(ticket.team)
      .then(setAgents)
      .catch(() => setAgents([]));
  }, [isAdmin, ticket?.team]);

  const customerName = useMemo(
    () =>
      ticket?.customerName ||
      ticket?.customer_name ||
      "Unknown customer",
    [ticket]
  );

  const customerEmail =
    ticket?.customerEmail ||
    ticket?.customer_email ||
    "—";

  const handleSave = async () => {
    setSaving(true);
    setError("");

    try {
      const updates = { status };

      if (isAdmin && assignedTo) {
        updates.assignedTo = assignedTo;
      }

      if (noteText.trim()) {
        updates.notes = noteText.trim();
      }

      await ticketApi.updateTicket(
        ticketId,
        updates
      );

      setNoteText("");
      await loadTicket();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="crm-shell page-only">
        <Navbar />
        <main className="workspace-main detail-loading">
          Loading ticket...
        </main>
      </div>
    );
  }

  if (error && !ticket) {
    return (
      <div className="crm-shell page-only">
        <Navbar />
        <main className="workspace-main">
          <div className="detail-error">
            <h2>Could not open ticket</h2>
            <p>{error}</p>
            <Link className="back-link" to="/">
              ← Back to tickets
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="crm-shell page-only">
      <Navbar />

      <main className="workspace-main detail-workspace">
        <header className="workspace-topbar detail-header">
          <div>
            <Link className="back-link" to="/">
              ← Back to tickets
            </Link>

            <p className="section-eyebrow">
              {ticket?.ticketId || ticketId}
            </p>

            <h1>
              {ticket?.subject || "Ticket details"}
            </h1>
          </div>

          <StatusBadge
            value={ticket?.status}
            type="status"
          />
        </header>

        {error && (
          <div className="inline-alert">
            {error}
          </div>
        )}

        <div className="detail-grid">
          <section className="detail-main-card">
            <div className="customer-header">
              <div className="avatar">
                {customerName
                  .charAt(0)
                  .toUpperCase()}
              </div>

              <div>
                <h2>{customerName}</h2>
                <a href={`mailto:${customerEmail}`}>
                  {customerEmail}
                </a>
              </div>
            </div>

            <div className="ticket-message">
              <p className="section-eyebrow">
                Customer message
              </p>
              <p className="preserve-lines">
                {ticket?.description ||
                  "No description provided."}
              </p>
            </div>

            <div className="triage-section">
              <div className="section-title-row">
                <div>
                  <p className="section-eyebrow">
                    AI triage
                  </p>
                  <h3>Classification</h3>
                </div>
              </div>

              <div className="triage-cards">
                <article>
                  <span>Category</span>
                  <StatusBadge
                    value={ticket?.category}
                    type="category"
                  />
                </article>

                <article>
                  <span>Priority</span>
                  <StatusBadge
                    value={ticket?.priority}
                    type="priority"
                  />
                </article>

                <article>
                  <span>Sentiment</span>
                  <StatusBadge
                    value={ticket?.sentiment}
                    type="sentiment"
                  />
                </article>

                <article>
                  <span>Team</span>
                  <strong>
                    {ticket?.team || "General"}
                  </strong>
                </article>
              </div>
            </div>

            <div className="notes-section">
              <div className="section-title-row">
                <div>
                  <p className="section-eyebrow">
                    Activity
                  </p>
                  <h3>Internal notes</h3>
                </div>
              </div>

              <NoteList notes={notes} />
            </div>
          </section>

          <aside className="ticket-sidebar-card">
            <h3>Ticket controls</h3>

            <label>
              Status
              <select
                value={status}
                onChange={(event) =>
                  setStatus(event.target.value)
                }
              >
                {STATUSES.map((item) => (
                  <option key={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>

            {isAdmin && (
              <label>
                Assign agent
                <select
                  value={assignedTo}
                  onChange={(event) =>
                    setAssignedTo(
                      event.target.value
                    )
                  }
                >
                  <option value="">
                    Unassigned
                  </option>

                  {agents.map((agent) => (
                    <option
                      key={agent._id}
                      value={agent._id}
                    >
                      {agent.name} · {agent.team}
                    </option>
                  ))}
                </select>
              </label>
            )}

            <label>
              Add internal note
              <textarea
                rows="5"
                value={noteText}
                onChange={(event) =>
                  setNoteText(
                    event.target.value
                  )
                }
                placeholder="Add a note for the support team..."
              />
            </label>

            <button
              type="button"
              className="primary-button full-width"
              onClick={handleSave}
              disabled={saving}
            >
              {saving
                ? "Saving..."
                : "Save changes"}
            </button>

            <dl className="ticket-meta">
              <div>
                <dt>Assigned to</dt>
                <dd>
                  {ticket?.assignedTo?.name ||
                    "Unassigned"}
                </dd>
              </div>

              <div>
                <dt>Created</dt>
                <dd>
                  {formatDate(
                    ticket?.created_at ||
                      ticket?.createdAt
                  )}
                </dd>
              </div>

              <div>
                <dt>Updated</dt>
                <dd>
                  {formatDate(
                    ticket?.updated_at ||
                      ticket?.updatedAt
                  )}
                </dd>
              </div>
            </dl>
          </aside>
        </div>
      </main>
    </div>
  );
}
