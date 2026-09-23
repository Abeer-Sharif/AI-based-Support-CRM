import { useState } from "react";
import {
  Link,
  useLocation,
  useNavigate
} from "react-router-dom";

import { authApi } from "../services/authApi.js";
import { useAuth } from "../context/AuthContext.jsx";
import "./Login.css";

export default function Login() {
  const [form, setForm] = useState({
    email: "",
    password: ""
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] =
    useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

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
      const response = await authApi.login(form);

      login({
        token: response.token,
        email: form.email
      });

      navigate(
        location.state?.from || "/",
        { replace: true }
      );
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
            Customer support,
            <br />
            without the chaos.
          </h1>

          <p>
            Manage tickets, route issues by AI triage,
            and keep your support team focused.
          </p>

          <div className="auth-features">
            <span>AI category detection</span>
            <span>Priority & sentiment triage</span>
            <span>Team-based assignment</span>
          </div>
        </div>
      </section>

      <section className="auth-form-panel">
        <div className="auth-card">
          <div className="auth-mobile-brand">
            <span className="brand-mark">S</span>
            <strong>SupportDesk</strong>
          </div>

          <p className="auth-eyebrow">
            WELCOME BACK
          </p>

          <h2>Sign in to your workspace</h2>

          <p className="auth-subtitle">
            Enter your account credentials to continue.
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
                placeholder="Enter your password"
                autoComplete="current-password"
                minLength="6"
                required
              />
            </label>

            <button
              type="submit"
              className="auth-primary-button"
              disabled={submitting}
            >
              {submitting
                ? "Signing in..."
                : "Sign in"}
            </button>
          </form>

          <p className="auth-switch">
            Need an account?{" "}
            <Link to="/register">
              Create account
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}
