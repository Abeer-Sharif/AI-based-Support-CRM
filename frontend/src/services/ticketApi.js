import api from "./api.js";

const getErrorMessage = (error) =>
  error.response?.data?.message ||
  error.message ||
  "Something went wrong. Please try again.";

export const ticketApi = {
  async getTickets(params = {}) {
    try {
      const { data } = await api.get(
        "/tickets",
        { params }
      );

      return Array.isArray(data)
        ? data
        : data.tickets || [];
    } catch (error) {
      throw new Error(getErrorMessage(error), {
        cause: error
      });
    }
  },

  async getTicket(ticketId) {
    try {
      const { data } = await api.get(
        `/tickets/${encodeURIComponent(ticketId)}`
      );
      return data;
    } catch (error) {
      throw new Error(getErrorMessage(error), {
        cause: error
      });
    }
  },

  async createTicket(ticket) {
    try {
      const { data } = await api.post(
        "/tickets",
        ticket
      );
      return data;
    } catch (error) {
      throw new Error(getErrorMessage(error), {
        cause: error
      });
    }
  },

  async updateTicket(ticketId, updates) {
    try {
      const { data } = await api.put(
        `/tickets/${encodeURIComponent(ticketId)}`,
        updates
      );
      return data;
    } catch (error) {
      throw new Error(getErrorMessage(error), {
        cause: error
      });
    }
  },

  async addNote(ticketId, noteText) {
    return this.updateTicket(ticketId, {
      notes: noteText
    });
  }
};
