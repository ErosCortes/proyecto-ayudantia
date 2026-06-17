import { API_BASE_URL } from "./api";

async function refreshToken() {
  const refresh = localStorage.getItem("refresh");
  if (!refresh) return null;
  try {
    const response = await fetch(`${API_BASE_URL}/auth/token/refresh/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh }),
    });
    if (response.ok) {
      const data = await response.json();
      localStorage.setItem("access", data.access);
      return data.access;
    }
  } catch {
    // ignore
  }
  return null;
}

async function apiClient(endpoint, options = {}) {
  let token = localStorage.getItem("access");

  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  let response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (response.status === 401 && token) {
    const newToken = await refreshToken();
    if (newToken) {
      headers["Authorization"] = `Bearer ${newToken}`;
      response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
      });
    }
  }

  return response;
}

export default apiClient;
