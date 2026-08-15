import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5001',
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const session = JSON.parse(sessionStorage.getItem('supportdesk.session') || 'null');
  if (session?.token) config.headers.Authorization = `Bearer ${session.token}`;
  return config;
});

const messageFromError = (error) =>
  error.response?.data?.message || error.message || 'Something went wrong. Please try again.';

export const ticketApi = {
  async getTickets(params = {}) {
    try {
      const { data } = await api.get('/tickets', { params });
      return data;
    } catch (error) {
      throw new Error(messageFromError(error));
    }
  },
  async getTicket(id) {
    try {
      const { data } = await api.get(`/tickets/${encodeURIComponent(id)}`);
      return data;
    } catch (error) {
      throw new Error(messageFromError(error));
    }
  },
  async createTicket(ticket) {
    try {
      const { data } = await api.post('/tickets', ticket);
      return data;
    } catch (error) {
      throw new Error(messageFromError(error));
    }
  },
  async updateTicket(id, updates) {
    try {
      const { data } = await api.put(`/tickets/${encodeURIComponent(id)}`, updates);
      return data;
    } catch (error) {
      throw new Error(messageFromError(error));
    }
  },
  addNote(id, notes) {
    return this.updateTicket(id, { notes });
  },
};
