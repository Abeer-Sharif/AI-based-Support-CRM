import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import Navbar from "../components/Navbar.jsx";
import SearchBar from "../components/SearchBar.jsx";
import StatusFilter from "../components/StatusFilter.jsx";
import TicketTable from "../components/TicketTable.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { ticketApi } from "../services/ticketApi.js";
import "./Ticket.css";

export default function Home() {
  const { session, isAdmin } = useAuth();

  const [tickets, setTickets] = useState([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [view, setView] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadTickets = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const params = {};

      if (status) {
        params.status = status;
      }

      if (search.trim()) {
        params.search = search.trim();
      }

      const data = await ticketApi.getTickets(params);
      setTickets(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [search, status]);

  useEffect(() => {
    const timer = setTimeout(loadTickets, 250);
    return () => clearTimeout(timer);
  }, [loadTickets]);

  const visibleTickets = useMemo(() => {
    if (view === "open") {
      return tickets.filter(
        (ticket) => ticket.status === "Open"
      );
    }

    if (view === "high") {
      return tickets.filter(
        (ticket) => ticket.priority === "High"
      );
    }

    if (view === "negative") {
      return tickets.filter(
        (ticket) => ticket.sentiment === "Negative"
      );
    }

    return tickets;
  }, [tickets, view]);

  const counts = useMemo(() => ({
    all: tickets.length,
    open: tickets.filter(
      (ticket) => ticket.status === "Open"
    ).length,
    high: tickets.filter(
      (ticket) => ticket.priority === "High"
    ).length,
    negative: tickets.filter(
      (ticket) => ticket.sentiment === "Negative"
    ).length
  }), [tickets]);

  return (
    <div className="crm-shell">
      <Navbar />

      <aside className="views-sidebar">
        <div className="views-header">
          <span className="section-eyebrow">
            Workspace
          </span>
          <h2>Views</h2>
        </div>

        <div className="view-list">
          <button
            type="button"
            className={view === "all" ? "active" : ""}
            onClick={() => setView("all")}
          >
            <span>All tickets</span>
            <b>{counts.all}</b>
          </button>

          <button
            type="button"
            className={view === "open" ? "active" : ""}
            onClick={() => setView("open")}
          >
            <span>Open</span>
            <b>{counts.open}</b>
          </button>

          <button
            type="button"
            className={view === "high" ? "active" : ""}
            onClick={() => setView("high")}
          >
            <span>High priority</span>
            <b>{counts.high}</b>
          </button>

          <button
            type="button"
            className={view === "negative" ? "active" : ""}
            onClick={() => setView("negative")}
          >
            <span>Negative sentiment</span>
            <b>{counts.negative}</b>
          </button>
        </div>

        <div className="workspace-card">
          <span>{isAdmin ? "Admin" : "Agent"}</span>
          <strong>{session?.team || "General"}</strong>
          <small>{session?.email}</small>
        </div>
      </aside>

      <main className="workspace-main">
        <header className="workspace-topbar">
          <div>
            <p className="section-eyebrow">
              Support workspace
            </p>
            <h1>Tickets</h1>
          </div>

          <Link
            className="primary-button"
            to="/tickets/new"
          >
            + New ticket
          </Link>
        </header>

        <section className="dashboard-summary">
          <article>
            <span>Total</span>
            <strong>{counts.all}</strong>
          </article>

          <article>
            <span>Open</span>
            <strong>{counts.open}</strong>
          </article>

          <article>
            <span>High priority</span>
            <strong>{counts.high}</strong>
          </article>

          <article>
            <span>Negative</span>
            <strong>{counts.negative}</strong>
          </article>
        </section>

        <section className="ticket-panel">
          <div className="ticket-toolbar">
            <SearchBar
              value={search}
              onChange={setSearch}
            />

            <StatusFilter
              value={status}
              onChange={setStatus}
            />

            <button
              type="button"
              className="secondary-button"
              onClick={loadTickets}
            >
              Refresh
            </button>
          </div>

          <TicketTable
            tickets={visibleTickets}
            loading={loading}
            error={error}
          />
        </section>
      </main>
    </div>
  );
}
