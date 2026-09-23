import api from "./api.js";

const getErrorMessage = (error) =>
  error.response?.data?.message ||
  error.message ||
  "Something went wrong. Please try again.";

export const userApi = {
  // Get all agents or agents from one team
  async getAgents(team = "") {
    try {
      const params = team ? { team } : {};

      const { data } = await api.get(
        "/auth/agents",
        { params }
      );

      return Array.isArray(data)
        ? data
        : data.agents || [];

    } catch (error) {
      throw new Error(
        getErrorMessage(error),
        { cause: error }
      );
    }
  },

  // Update role/team of a user
  async updateUser(name, updates) {
    try {
      const { data } = await api.put(
        `/auth/users/${encodeURIComponent(name)}`,
        updates
      );

      return data;

    } catch (error) {
      throw new Error(
        getErrorMessage(error),
        { cause: error }
      );
    }
  }
};