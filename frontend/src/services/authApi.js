import api from "./api.js";

const getErrorMessage = (error) =>
  error.response?.data?.message ||
  error.message ||
  "Something went wrong. Please try again.";

export const authApi = {
  async login(credentials) {
    try {
      const { data } = await api.post(
        "/auth/login",
        credentials
      );
      return data;
    } catch (error) {
      throw new Error(getErrorMessage(error), {
        cause: error
      });
    }
  },

  async register(user) {
    try {
      const { data } = await api.post(
        "/auth/register",
        user
      );
      return data;
    } catch (error) {
      throw new Error(getErrorMessage(error), {
        cause: error
      });
    }
  }
};
