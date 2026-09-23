import axios from "axios";

const SESSION_KEY = "supportdesk.session";

const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL ||
    "http://localhost:5001",
  headers: {
    "Content-Type": "application/json"
  }
});

api.interceptors.request.use((config) => {
  try {
    const session = JSON.parse(
      sessionStorage.getItem(SESSION_KEY) || "null"
    );

    if (session?.token) {
      config.headers.Authorization =
        `Bearer ${session.token}`;
    }
  } catch {
    sessionStorage.removeItem(SESSION_KEY);
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      sessionStorage.removeItem(SESSION_KEY);
    }

    return Promise.reject(error);
  }
);

export default api;
