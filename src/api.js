const API_BASE = import.meta.env.VITE_API_BASE_URL || "/api";

const AUTH_KEYS = {
  token: "bh_token",
  refreshToken: "bh_refresh_token",
  clientId: "bh_client_id",
  email: "bh_email",
};

export function getAuthToken() {
  return localStorage.getItem(AUTH_KEYS.token) || "";
}

export function getClientId() {
  return localStorage.getItem(AUTH_KEYS.clientId) || "";
}

export function setAuthSession(payload) {
  if (payload?.token) {
    localStorage.setItem(AUTH_KEYS.token, payload.token);
  }
  if (payload?.refresh_token) {
    localStorage.setItem(AUTH_KEYS.refreshToken, payload.refresh_token);
  }
  if (payload?.client_id) {
    localStorage.setItem(AUTH_KEYS.clientId, payload.client_id);
  }
  if (payload?.email) {
    localStorage.setItem(AUTH_KEYS.email, payload.email);
  }
}

export function clearAuthSession() {
  Object.values(AUTH_KEYS).forEach((key) => localStorage.removeItem(key));
}

async function request(path, options = {}) {
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  const token = getAuthToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message =
      data?.error || data?.message || data?.description || `HTTP ${response.status}`;
    const error = new Error(message);
    error.status = response.status;
    error.payload = data;
    throw error;
  }

  return data;
}

export const loginUser = (credentials) =>
  request("/auth/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  });

export const getMe = () => request("/auth/me");

export const updateProfilePhoto = (profilePhoto) =>
  request("/auth/me/photo", {
    method: "PATCH",
    body: JSON.stringify({ profile_photo: profilePhoto }),
  });

export const getClientRecommendation = (clientId) =>
  request(`/recommendations/${clientId}`);

export const getProductsCatalog = (category) =>
  request(`/auth/products${category ? `?category=${encodeURIComponent(category)}` : ""}`);

export const simulateLoan = (payload) =>
  request("/auth/simulator", {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const savingsProjection = (payload) =>
  request("/auth/savings-projection", {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const getBudget = (month) =>
  request(`/auth/budget${month ? `?month=${encodeURIComponent(month)}` : ""}`);

export const upsertBudget = (payload) =>
  request("/auth/budget", {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const getComplaints = () => request("/auth/complaints");

export const createComplaint = (payload) =>
  request("/auth/complaints", {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const listChatSessions = (clientId) => request(`/chat/${clientId}/sessions`);

export const createChatSession = (clientId) =>
  request(`/chat/${clientId}/sessions`, { method: "POST" });

export const getChatHistory = (clientId, sessionId) =>
  request(`/chat/${clientId}/history${sessionId ? `?session_id=${sessionId}` : ""}`);

export const sendChatMessage = (clientId, message, sessionId) =>
  request(`/chat/${clientId}`, {
    method: "POST",
    body: JSON.stringify({
      message,
      ...(sessionId ? { session_id: sessionId } : {}),
    }),
  });

export const getFormData = (clientId) => request(`/form/${clientId}`);

export const getFormSchema = () => request("/form/schema");

export const submitForm = (clientId, payload) =>
  request(`/form/${clientId}`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
