const API_BASE = import.meta.env.VITE_API_BASE_URL || "/api";

const CLIENT_AUTH_KEYS = {
  token: "bh_token",
  refreshToken: "bh_refresh_token",
  clientId: "bh_client_id",
  email: "bh_email",
};

const AGENT_AUTH_KEYS = {
  token: "bh_agent_token",
  refreshToken: "bh_agent_refresh_token",
  agentId: "bh_agent_id",
  email: "bh_agent_email",
  fullName: "bh_agent_full_name",
  role: "bh_agent_role",
  agence: "bh_agent_agence",
};

export function getAuthToken() {
  return localStorage.getItem(CLIENT_AUTH_KEYS.token) || "";
}

export function getClientId() {
  return localStorage.getItem(CLIENT_AUTH_KEYS.clientId) || "";
}

export function setAuthSession(payload) {
  if (payload?.token) {
    localStorage.setItem(CLIENT_AUTH_KEYS.token, payload.token);
  }
  if (payload?.refresh_token) {
    localStorage.setItem(CLIENT_AUTH_KEYS.refreshToken, payload.refresh_token);
  }
  if (payload?.client_id) {
    localStorage.setItem(CLIENT_AUTH_KEYS.clientId, payload.client_id);
  }
  if (payload?.email) {
    localStorage.setItem(CLIENT_AUTH_KEYS.email, payload.email);
  }
}

export function clearAuthSession() {
  Object.values(CLIENT_AUTH_KEYS).forEach((key) => localStorage.removeItem(key));
}

export function getAgentAuthToken() {
  return localStorage.getItem(AGENT_AUTH_KEYS.token) || "";
}

export function getAgentId() {
  return localStorage.getItem(AGENT_AUTH_KEYS.agentId) || "";
}

export function setAgentAuthSession(payload) {
  if (payload?.token) {
    localStorage.setItem(AGENT_AUTH_KEYS.token, payload.token);
  }
  if (payload?.refresh_token) {
    localStorage.setItem(AGENT_AUTH_KEYS.refreshToken, payload.refresh_token);
  }

  const agent = payload?.agent || {};
  if (agent?.agent_id) {
    localStorage.setItem(AGENT_AUTH_KEYS.agentId, agent.agent_id);
  }
  if (agent?.email) {
    localStorage.setItem(AGENT_AUTH_KEYS.email, agent.email);
  }
  if (agent?.full_name) {
    localStorage.setItem(AGENT_AUTH_KEYS.fullName, agent.full_name);
  }
  if (agent?.role) {
    localStorage.setItem(AGENT_AUTH_KEYS.role, agent.role);
  }
  if (agent?.agence) {
    localStorage.setItem(AGENT_AUTH_KEYS.agence, agent.agence);
  }
}

export function clearAgentAuthSession() {
  Object.values(AGENT_AUTH_KEYS).forEach((key) => localStorage.removeItem(key));
}

async function requestWithToken(path, options = {}, token = "") {
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const validationErrors = Array.isArray(data?.errors) ? data.errors : [];
    const message =
      data?.error ||
      data?.message ||
      data?.description ||
      (validationErrors.length ? validationErrors.join(" | ") : `HTTP ${response.status}`);
    const error = new Error(message);
    error.status = response.status;
    error.payload = data;
    throw error;
  }

  return data;
}

async function request(path, options = {}) {
  return requestWithToken(path, options, getAuthToken());
}

async function requestAgent(path, options = {}) {
  return requestWithToken(path, options, getAgentAuthToken());
}

export const loginUser = (credentials) =>
  request("/auth/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  });

export const loginAgent = (credentials) =>
  request("/auth/agent/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  });

export const getAgentMe = () => requestAgent("/auth/agent/me");

export const getAgentDashboard = () => requestAgent("/agent/dashboard");

export const searchAgentClient = (cin) =>
  requestAgent(`/agent/search?cin=${encodeURIComponent(cin)}`);

export const getAgentCreditAnalysis = (idPiece) =>
  requestAgent(`/agent/clients/${encodeURIComponent(idPiece)}/credit-analysis`);

export const getAgentActivityLog = (limit = 50) =>
  requestAgent(`/agent/activity-log?limit=${encodeURIComponent(limit)}`);

export const verifyCard = (payload) =>
  request("/auth/verify-card", {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const verifyOTP = (payload) =>
  request("/auth/verify-otp", {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const registerAccount = (payload) =>
  request("/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const verifyEmail = (payload) =>
  request("/auth/verify-email", {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const resendEmailOTP = async (payload) => {
  try {
    return await request("/auth/resend-email-otp", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  } catch (error) {
    if (error?.status === 404) {
      return request("/auth/resend-email-code", {
        method: "POST",
        body: JSON.stringify(payload),
      });
    }
    throw error;
  }
};

export const getMe = () => request("/auth/me");

export const revealMyCardInfo = (code) =>
  request("/auth/me/card/reveal", {
    method: "POST",
    body: JSON.stringify({ code }),
  });

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
