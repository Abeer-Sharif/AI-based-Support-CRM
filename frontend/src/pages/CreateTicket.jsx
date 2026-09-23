import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar.jsx";
import { ticketApi } from "../services/ticketApi.js";
import "./Ticket.css";

export default function CreateTicket() {
  const [form, setForm] = useState({
    customer_name: "",
    customer_email: "",
    subject: "",
    description: ""
  });

  const [error, setError] = useState("");
  const [submitting, setSubmitting] =
    useState(false);

  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!event.currentTarget.checkValidity()) {
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const response =
        await ticketApi.createTicket(form);

      const ticketId =
        response.ticket_id ||
        response.ticketId ||
        response.ticket?.ticketId;

      navigate(
        ticketId
          ? `/tickets/${encodeURIComponent(ticketId)}`
          : "/"
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="crm-shell page-only">
      <Navbar />

      <main className="workspace-main form-workspace">
        <header className="workspace-topbar">
          <div>
            <Link className="back-link" to="/">
              ← Back to tickets
            </Link>
            <p className="section-eyebrow">
              Agent workspace
            </p>
            <h1>Create ticket</h1>
          </div>
        </header>

        <section className="form-card">
          <div className="form-card-intro">
            <h2>Customer issue</h2>
            <p>
              The backend will use AI to classify category,
              priority and sentiment, then map the ticket to
              the appropriate team.
            </p>
          </div>

          {error && (
            <div className="inline-alert">
              {error}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="ticket-form"
          >
            <div className="field-grid">
              <label>
                Customer name
                <input
                  name="customer_name"
                  value={form.customer_name}
                  onChange={handleChange}
                  placeholder="Customer name"
                  required
                />
              </label>

              <label>
                Customer email
                <input
                  type="email"
                  name="customer_email"
                  value={form.customer_email}
                  onChange={handleChange}
                  placeholder="customer@example.com"
                  required
                />
              </label>
            </div>

            <label>
              Subject
              <input
                name="subject"
                value={form.subject}
                onChange={handleChange}
                placeholder="Short summary of the issue"
                required
              />
            </label>

            <label>
              Description
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows="8"
                placeholder="Describe the customer's issue..."
                required
              />
            </label>

            <div className="form-actions">
              <Link
                className="secondary-button link-button"
                to="/"
              >
                Cancel
              </Link>

              <button
                type="submit"
                className="primary-button"
                disabled={submitting}
              >
                {submitting
                  ? "Creating & triaging..."
                  : "Create ticket"}
              </button>
            </div>
          </form>
        </section>
      </main>
    </div>
  );
}
