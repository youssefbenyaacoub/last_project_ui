const CLIENT_CACHE_PREFIX = "bh_client_offline_cache_v1_";

const OFFLINE_CACHE_MAX_AGE_MS = 24 * 60 * 60 * 1000;

const hasStorage = () => typeof window !== "undefined" && !!window.localStorage;

const isValidClientId = (clientId) => String(clientId || "").trim().length > 0;

const isValidMonthKey = (monthKey) => /^\d{4}-\d{2}$/.test(String(monthKey || "").trim());

const getClientCacheKey = (clientId) => `${CLIENT_CACHE_PREFIX}${String(clientId).trim()}`;

const safeParseJson = (raw) => {
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

const normalizeObject = (value) => {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  return value;
};

const normalizeSchemaFields = (value) => {
  if (!Array.isArray(value)) return [];
  return value.filter((item) => item && typeof item === "object");
};

const readClientCacheRecord = (clientId) => {
  if (!hasStorage() || !isValidClientId(clientId)) return null;

  const raw = window.localStorage.getItem(getClientCacheKey(clientId));
  const parsed = safeParseJson(raw);
  if (!parsed || typeof parsed !== "object") return null;
  return parsed;
};

const writeClientCacheRecord = (clientId, record) => {
  if (!hasStorage() || !isValidClientId(clientId)) return;
  if (!record || typeof record !== "object") return;
  window.localStorage.setItem(getClientCacheKey(clientId), JSON.stringify(record));
};

const parseUpdatedAtMs = (updatedAt) => {
  const timestamp = Date.parse(String(updatedAt || ""));
  return Number.isFinite(timestamp) ? timestamp : 0;
};

export const isOfflineCacheStale = (updatedAt, maxAgeMs = OFFLINE_CACHE_MAX_AGE_MS) => {
  const updatedAtMs = parseUpdatedAtMs(updatedAt);
  if (!updatedAtMs) return true;
  return Date.now() - updatedAtMs > Number(maxAgeMs || OFFLINE_CACHE_MAX_AGE_MS);
};

const normalizeBudgetByMonth = (value) => {
  if (!value || typeof value !== "object") return {};

  const output = {};
  Object.entries(value).forEach(([key, rows]) => {
    if (!isValidMonthKey(key)) return;
    if (!Array.isArray(rows)) return;
    output[key] = rows;
  });

  return output;
};

export const readDashboardOfflineCache = (clientId) => {
  const parsed = readClientCacheRecord(clientId);
  if (!parsed) return null;

  return {
    updatedAt: String(parsed.updated_at || "").trim(),
    recommendation: parsed.recommendation || null,
    profile: parsed.profile || null,
    monthlyHealthReport: parsed.monthly_health_report || null,
    budgetByMonth: normalizeBudgetByMonth(parsed.budget_by_month),
  };
};

export const writeDashboardOfflineCache = (clientId, payload) => {
  if (!hasStorage() || !isValidClientId(clientId)) return;
  if (!payload || typeof payload !== "object") return;

  const current = readClientCacheRecord(clientId) || {};
  const mergedBudgetByMonth = {
    ...normalizeBudgetByMonth(current.budget_by_month),
    ...normalizeBudgetByMonth(payload.budgetByMonth),
  };

  const record = {
    updated_at: String(payload.updatedAt || new Date().toISOString()),
    recommendation: payload.recommendation ?? current.recommendation ?? null,
    profile: payload.profile ?? current.profile ?? null,
    monthly_health_report: payload.monthlyHealthReport ?? current.monthly_health_report ?? null,
    budget_by_month: mergedBudgetByMonth,
    profile_form_schema: normalizeSchemaFields(current.profile_form_schema),
    profile_form_values: normalizeObject(current.profile_form_values),
  };

  writeClientCacheRecord(clientId, record);
};

export const cacheDashboardBudgetMonth = (clientId, monthKey, categories) => {
  if (!isValidMonthKey(monthKey)) return;
  if (!Array.isArray(categories)) return;

  const current = readDashboardOfflineCache(clientId);
  const budgetByMonth = {
    ...(current?.budgetByMonth || {}),
    [monthKey]: categories,
  };

  writeDashboardOfflineCache(clientId, {
    updatedAt: current?.updatedAt || new Date().toISOString(),
    recommendation: current?.recommendation || null,
    profile: current?.profile || null,
    monthlyHealthReport: current?.monthlyHealthReport || null,
    budgetByMonth,
  });
};

export const readDashboardBudgetMonthFromCache = (clientId, monthKey) => {
  if (!isValidMonthKey(monthKey)) return [];
  const cache = readDashboardOfflineCache(clientId);
  const rows = cache?.budgetByMonth?.[monthKey];
  return Array.isArray(rows) ? rows : [];
};

export const readProfileOfflineCache = (clientId) => {
  const parsed = readClientCacheRecord(clientId);
  if (!parsed) return null;

  return {
    updatedAt: String(parsed.updated_at || "").trim(),
    profile: parsed.profile || null,
    schemaFields: normalizeSchemaFields(parsed.profile_form_schema),
    formValues: normalizeObject(parsed.profile_form_values),
  };
};

export const writeProfileOfflineCache = (clientId, payload) => {
  if (!hasStorage() || !isValidClientId(clientId)) return;
  if (!payload || typeof payload !== "object") return;

  const current = readClientCacheRecord(clientId) || {};

  const record = {
    updated_at: String(payload.updatedAt || new Date().toISOString()),
    recommendation: current.recommendation ?? null,
    profile: payload.profile ?? current.profile ?? null,
    monthly_health_report: current.monthly_health_report ?? null,
    budget_by_month: normalizeBudgetByMonth(current.budget_by_month),
    profile_form_schema:
      payload.schemaFields != null
        ? normalizeSchemaFields(payload.schemaFields)
        : normalizeSchemaFields(current.profile_form_schema),
    profile_form_values:
      payload.formValues != null
        ? normalizeObject(payload.formValues)
        : normalizeObject(current.profile_form_values),
  };

  writeClientCacheRecord(clientId, record);
};
