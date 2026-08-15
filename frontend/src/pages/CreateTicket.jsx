import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ticketApi } from '../services/ticketApi';

const initialForm = { customer_name: '', customer_email: '', subject: '', description: '' };

export default function CreateTicket() {
  const [form, setForm] = useState(initialForm);
  const [validated, setValidated] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const updateField = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }));

  const submit = async (event) => {
    event.preventDefault();
    setValidated(true);
    if (!event.currentTarget.checkValidity()) return;
    setSubmitting(true);
    setError('');
    try {
      const created = await ticketApi.createTicket(form);
      navigate(`/tickets/${encodeURIComponent(created.ticket_id)}`, { state: { message: 'Ticket created successfully.' } });
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="form-page">
      <div className="mb-4"><p className="eyebrow mb-1">New request</p><h1 className="h2 mb-1">Create support ticket</h1><p className="text-secondary mb-0">Record the customer issue and it will appear in the support queue.</p></div>
      <form className={`card shadow-sm border-0 ${validated ? 'was-validated' : ''}`} noValidate onSubmit={submit}>
        <div className="card-body p-4 p-lg-5">
          {error && <div className="alert alert-danger" role="alert">{error}</div>}
          <div className="row g-3">
            <div className="col-md-6"><label className="form-label" htmlFor="customer_name">Customer name</label><input className="form-control" id="customer_name" name="customer_name" value={form.customer_name} onChange={updateField} required /><div className="invalid-feedback">Enter the customer's name.</div></div>
            <div className="col-md-6"><label className="form-label" htmlFor="customer_email">Customer email</label><input className="form-control" id="customer_email" type="email" name="customer_email" value={form.customer_email} onChange={updateField} required /><div className="invalid-feedback">Enter a valid email address.</div></div>
            <div className="col-12"><label className="form-label" htmlFor="subject">Issue title</label><input className="form-control" id="subject" name="subject" value={form.subject} onChange={updateField} required /><div className="invalid-feedback">Enter a concise issue title.</div></div>
            <div className="col-12"><label className="form-label" htmlFor="description">Description</label><textarea className="form-control" id="description" name="description" rows="6" value={form.description} onChange={updateField} required /><div className="invalid-feedback">Describe the issue.</div></div>
          </div>
          <div className="d-flex gap-2 mt-4"><button className="btn btn-primary" disabled={submitting} type="submit">{submitting ? 'Creating...' : 'Create ticket'}</button><button className="btn btn-outline-secondary" type="button" onClick={() => navigate('/')}>Cancel</button></div>
        </div>
      </form>
    </section>
  );
}
