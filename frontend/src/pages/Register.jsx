import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authApi } from '../services/authApi';

export default function Register() {
  const { isAuthenticated } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [validated, setValidated] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  if (isAuthenticated) return <Navigate to="/" replace />;

  const submit = async (event) => {
    event.preventDefault(); setValidated(true);
    if (!event.currentTarget.checkValidity()) return;
    setSubmitting(true); setError('');
    try { await authApi.register(form); navigate('/login', { state: { message: 'Registration complete. You can now sign in.' } }); } catch (err) { setError(err.message); } finally { setSubmitting(false); }
  };
  const setField = (event) => setForm({ ...form, [event.target.name]: event.target.value });

  return <section className="auth-page"><div className="mb-4"><p className="eyebrow mb-1">SupportDesk</p><h1 className="h2 mb-0">Create account</h1></div><form className={`card shadow-sm border-0 ${validated ? 'was-validated' : ''}`} noValidate onSubmit={submit}><div className="card-body p-4"><>{error && <div className="alert alert-danger">{error}</div>}</><div className="mb-3"><label className="form-label" htmlFor="name">Name</label><input className="form-control" id="name" name="name" value={form.name} onChange={setField} required /><div className="invalid-feedback">Enter your name.</div></div><div className="mb-3"><label className="form-label" htmlFor="email">Email</label><input className="form-control" id="email" name="email" type="email" value={form.email} onChange={setField} required /><div className="invalid-feedback">Enter a valid email address.</div></div><div className="mb-4"><label className="form-label" htmlFor="password">Password</label><input className="form-control" id="password" name="password" type="password" minLength="6" value={form.password} onChange={setField} required /><div className="invalid-feedback">Use at least 6 characters.</div></div><button className="btn btn-primary w-100" type="submit" disabled={submitting}>{submitting ? 'Creating account...' : 'Register'}</button><p className="text-center text-secondary mt-3 mb-0">Already registered? <Link to="/login">Login</Link></p></div></form></section>;
}
