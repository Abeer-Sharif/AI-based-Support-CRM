import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authApi } from "../services/authApi.js";
import "./Login.css";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
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
      await authApi.register(form);

      navigate("/login", {
        replace: true
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-brand-panel">
        <div className="auth-brand-copy">
          <span className="brand-mark">S</span>

          <p className="auth-eyebrow">
            SUPPORTDESK
          </p>

          <h1>
            One place for every
            <br />
            support request.
          </h1>

          <p>
            New accounts are created as agents in the
            General team. An admin can update role and
            team later.
          </p>
        </div>
      </section>

      <section className="auth-form-panel">
        <div className="auth-card">
          <div className="auth-mobile-brand">
            <span className="brand-mark">S</span>
            <strong>SupportDesk</strong>
          </div>

          <p className="auth-eyebrow">
            CREATE ACCOUNT
          </p>

          <h2>Register as an agent</h2>

          <p className="auth-subtitle">
            Set up your account to access the support CRM.
          </p>

          {error && (
            <div className="auth-alert">
              {error}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="auth-form"
          >
            <label>
              Full name
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Your name"
                minLength="2"
                required
              />
            </label>

            <label>
              Email address
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                autoComplete="email"
                required
              />
            </label>

            <label>
              Password
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Minimum 6 characters"
                minLength="6"
                autoComplete="new-password"
                required
              />
            </label>

            <button
              type="submit"
              className="auth-primary-button"
              disabled={submitting}
            >
              {submitting
                ? "Creating account..."
                : "Create account"}
            </button>
          </form>

          <p className="auth-switch">
            Already registered?{" "}
            <Link to="/login">Sign in</Link>
          </p>
        </div>
      </section>
    </main>
  );
}
