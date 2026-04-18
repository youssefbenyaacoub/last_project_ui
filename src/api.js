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

function getAuthToken() {
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
    let message =
      data?.error ||
      data?.message ||
      data?.description ||
      (validationErrors.length ? validationErrors.join(" | ") : `HTTP ${response.status}`);

    if (
      response.status === 404 &&
      /requested url was not found on the server/i.test(String(message || ""))
    ) {
      message = "Endpoint API introuvable sur le backend.";
    }

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

function extractDownloadFileName(contentDisposition, fallbackName) {
  const raw = String(contentDisposition || "");
  if (!raw) return fallbackName;

  const utf8Match = raw.match(/filename\*=UTF-8''([^;]+)/i);
  if (utf8Match?.[1]) {
    try {
      return decodeURIComponent(utf8Match[1]).replace(/['"]/g, "") || fallbackName;
    } catch {
      return utf8Match[1].replace(/['"]/g, "") || fallbackName;
    }
  }

  const simpleMatch = raw.match(/filename="?([^";]+)"?/i);
  if (simpleMatch?.[1]) {
    return simpleMatch[1].trim() || fallbackName;
  }

  return fallbackName;
}

export const loginUser = (credentials) =>
  request("/auth/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  });

export const checkAgentPortalAccess = () =>
  requestWithToken(
    "/auth/agent/portal-access",
    {
      method: "GET",
    },
    "",
  );

export const loginAgent = (credentials) =>
  request("/auth/agent/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  });

export const requestAgentPasswordReset = (payload) =>
  request("/auth/agent/forgot-password-request", {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const requestClientPasswordReset = (payload) =>
  request("/auth/client/forgot-password-request", {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const resetAgentPasswordWithLink = (payload) =>
  request("/auth/agent/reset-password-link", {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const resetClientPasswordWithLink = (payload) =>
  request("/auth/client/reset-password-link", {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const getAgentMe = () => requestAgent("/auth/agent/me");

export const changeAgentPassword = (payload) =>
  requestAgent("/auth/agent/change-password", {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const getAgentDashboard = () => requestAgent("/agent/dashboard");

export const downloadAgentMonthlyReport = async (month, format = "xlsx") => {
  const params = new URLSearchParams();
  if (month) params.set("month", String(month));
  const normalizedFormat = String(format || "xlsx").trim().toLowerCase() === "pdf" ? "pdf" : "xlsx";
  params.set("format", normalizedFormat);

  const fallbackName = `rapport_mensuel_clients_${month || "courant"}.${normalizedFormat}`;
  const token = getAgentAuthToken();
  const acceptHeader =
    normalizedFormat === "pdf"
      ? "application/pdf"
      : "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
  const response = await fetch(`${API_BASE}/agent/reports/monthly${params.toString() ? `?${params.toString()}` : ""}`, {
    method: "GET",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      Accept: acceptHeader,
    },
  });

  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    const message =
      payload?.error ||
      payload?.message ||
      payload?.description ||
      `HTTP ${response.status}`;
    const error = new Error(message);
    error.status = response.status;
    error.payload = payload;
    throw error;
  }

  const blob = await response.blob();
  const contentType = String(response.headers.get("content-type") || "").toLowerCase();
  const filename = extractDownloadFileName(
    response.headers.get("content-disposition"),
    fallbackName,
  );

  const lowerFileName = String(filename || "").toLowerCase();
  const responseLooksPdf = contentType.includes("application/pdf") || lowerFileName.endsWith(".pdf");
  const responseLooksXlsx =
    contentType.includes("spreadsheetml") ||
    lowerFileName.endsWith(".xlsx") ||
    lowerFileName.endsWith(".xls");

  if (normalizedFormat === "pdf" && responseLooksXlsx && !responseLooksPdf) {
    const error = new Error(
      "Le serveur a renvoye un fichier Excel au lieu d'un PDF. Redemarrez le backend puis reessayez.",
    );
    error.status = 409;
    throw error;
  }

  if (normalizedFormat === "xlsx" && responseLooksPdf && !responseLooksXlsx) {
    const error = new Error(
      "Le serveur a renvoye un PDF au lieu d'un fichier Excel.",
    );
    error.status = 409;
    throw error;
  }

  return { blob, filename };
};

export const getAgentComplaints = (status = "open", limit = 120, q = "") => {
  const params = new URLSearchParams();
  if (status) params.set("status", String(status));
  if (limit) params.set("limit", String(limit));
  if (q) params.set("q", String(q));
  const suffix = params.toString();
  return requestAgent(`/agent/complaints${suffix ? `?${suffix}` : ""}`);
};

export const updateAgentComplaint = (complaintId, payload) =>
  requestAgent(`/agent/complaints/${encodeURIComponent(complaintId)}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });

export const fillAgentClientAgencies = (payload = {}) =>
  requestAgent("/agent/clients/fill-agences", {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const searchAgentClient = (cin) =>
  requestAgent(`/agent/search?cin=${encodeURIComponent(cin)}`);

export const getAgentCreditAnalysis = (idPiece) =>
  requestAgent(`/agent/clients/${encodeURIComponent(idPiece)}/credit-analysis`);

export const getAgentClientComplaints = (idPiece) =>
  requestAgent(`/agent/clients/${encodeURIComponent(idPiece)}/complaints`);

export const updateAgentClientComplaint = (idPiece, complaintId, payload) =>
  requestAgent(
    `/agent/clients/${encodeURIComponent(idPiece)}/complaints/${encodeURIComponent(complaintId)}`,
    {
      method: "PATCH",
      body: JSON.stringify(payload),
    },
  );

export const getAdminPlatformOverview = (days = 30, failedThreshold = 3) =>
  requestAgent(
    `/admin/platform-overview?days=${encodeURIComponent(days)}&failed_threshold=${encodeURIComponent(
      failedThreshold,
    )}`,
  );

export const listAdminAgents = () => requestAgent("/admin/agents");

export const createAdminAgent = (payload) =>
  requestAgent("/admin/agents", {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const listAdminAgentPasswordResetRequests = (status = "pending", limit = 50) =>
  requestAgent(
    `/auth/admin/agent-password-reset-requests?status=${encodeURIComponent(
      status,
    )}&limit=${encodeURIComponent(limit)}`,
  );

export const decideAdminAgentPasswordResetRequest = (requestId, payload) =>
  requestAgent(
    `/auth/admin/agent-password-reset-requests/${encodeURIComponent(requestId)}/decision`,
    {
      method: "POST",
      body: JSON.stringify(payload),
    },
  );

export const listAdminClientPasswordResetRequests = (status = "pending", limit = 50) =>
  requestAgent(
    `/auth/admin/client-password-reset-requests?status=${encodeURIComponent(
      status,
    )}&limit=${encodeURIComponent(limit)}`,
  );

export const decideAdminClientPasswordResetRequest = (requestId, payload) =>
  requestAgent(
    `/auth/admin/client-password-reset-requests/${encodeURIComponent(requestId)}/decision`,
    {
      method: "POST",
      body: JSON.stringify(payload),
    },
  );

export const requestSigninEmailCode = (payload) =>
  request("/auth/signin/request-email-code", {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const verifySigninEmailCode = (payload) =>
  request("/auth/signin/verify-email-code", {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const completeSigninRegistration = (payload) =>
  request("/auth/signin/complete", {
    method: "POST",
    body: JSON.stringify(payload),
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
