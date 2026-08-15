import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authApi } from '../services/authApi';

export default function Login() {
  const { login, isAuthenticated } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [validated, setValidated] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  if (isAuthenticated) return <Navigate to="/" replace />;

  const submit = async (event) => {
    event.preventDefault(); setValidated(true);
    if (!event.currentTarget.checkValidity()) return;
    setSubmitting(true); setError('');
    try {
      const response = await authApi.login(form);
      login({ token: response.token, email: form.email });
      navigate(location.state?.from || '/', { replace: true });
    } catch (err) { setError(err.message); } finally { setSubmitting(false); }
  };

  return <section className="auth-page"><div className="mb-4"><p className="eyebrow mb-1">SupportDesk</p><h1 className="h2 mb-0">Sign in</h1></div>{location.state?.message && <div className="alert alert-success">{location.state.message}</div>}<form className={`card shadow-sm border-0 ${validated ? 'was-validated' : ''}`} noValidate onSubmit={submit}><div className="card-body p-4"><>{error && <div className="alert alert-danger">{error}</div>}</><div className="mb-3"><label className="form-label" htmlFor="email">Email</label><input className="form-control" id="email" type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} required /><div className="invalid-feedback">Enter a valid email address.</div></div><div className="mb-4"><label className="form-label" htmlFor="password">Password</label><input className="form-control" id="password" type="password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} required /><div className="invalid-feedback">Enter your password.</div></div><button className="btn btn-primary w-100" type="submit" disabled={submitting}>{submitting ? 'Signing in...' : 'Login'}</button><p className="text-center text-secondary mt-3 mb-0">Need an account? <Link to="/register">Register</Link></p></div></form></section>;
}
