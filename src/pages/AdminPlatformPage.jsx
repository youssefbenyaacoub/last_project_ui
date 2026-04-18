import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  LogOut,
  RefreshCcw,
  ShieldUser,
  UserCog,
  Users,
  XCircle,
} from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";
import { useLanguage } from "../contexts/LanguageContext";
import logoExpanded from "../assets/BH_logo2.png";
import flagAr from "../assets/flags/Flag_of_Tunisia.svg.webp";
import flagEn from "../assets/flags/Flag_of_the_United_Kingdom_(3-5).svg.webp";
import flagFr from "../assets/flags/Flag_of_France.svg.png";
import {
  clearAgentAuthSession,
  createAdminAgent,
  decideAdminAgentPasswordResetRequest,
  decideAdminClientPasswordResetRequest,
  getAdminPlatformOverview,
  getAgentAuthToken,
  getAgentMe,
  listAdminAgentPasswordResetRequests,
  listAdminClientPasswordResetRequests,
  listAdminAgents,
} from "../api";

const copyByLanguage = {
  fr: {
    title: "Plateforme admin",
    subtitle: "Pilotage risques login, visiteurs et gestion des agents",
    logout: "Deconnexion",
    loading: "Chargement de la plateforme admin...",
    notAdmin: "Acces reserve aux administrateurs BH Bank.",
    refresh: "Actualiser",
    periodDays: "Periode (jours)",
    failedThreshold: "Seuil echec login",
    visitorsCard: "Visiteurs uniques",
    successLoginsCard: "Connexions reussies",
    riskyClientsCard: "Clients en alerte",
    activeAgentsCard: "Agents actifs",
    visitorsHint: "Estimation basee sur les connexions clients",
    riskyTitle: "Clients avec echec login repete",
    riskyEmpty: "Aucun client au-dessus du seuil.",
    colEmail: "Email client",
    colClientId: "Client ID",
    colFailedAttempts: "Nb echecs",
    colLastFailure: "Dernier echec",
    createAgentTitle: "Creer un compte agent",
    fullName: "Nom complet",
    email: "Email",
    agency: "Agence",
    role: "Role",
    username: "Username (optionnel)",
    password: "Mot de passe (optionnel)",
    roleAgent: "Agent",
    roleAdmin: "Admin",
    createAgent: "Creer agent",
    creating: "Creation...",
    generatedPasswordLabel: "Mot de passe a partager",
    agentsTitle: "Agents BH",
    resetPassword: "Reset mot de passe",
    resetting: "Reset...",
    noAgents: "Aucun agent trouve.",
    createdAt: "Cree le",
    lastLogin: "Derniere connexion",
    unknownDate: "-",
    resetRequestsTitle: "Demandes reset mot de passe agent",
    resetRequestsEmpty: "Aucune demande en attente.",
    resetRequestsRefresh: "Actualiser demandes",
    resetRequestIdentifier: "Identifiant saisi",
    resetRequestReason: "Raison",
    resetRequestRequestedAt: "Demande le",
    resetDecisionNote: "Note admin (optionnel)",
    approveRequest: "Approuver",
    rejectRequest: "Refuser",
    deciding: "Traitement...",
    clientResetRequestsTitle: "Demandes reset mot de passe client",
    clientResetRequestsEmpty: "Aucune demande client en attente.",
    clientResetRequestsRefresh: "Actualiser demandes client",
    clientResetRequestIdentifier: "Email saisi",
    clientResetRequestReason: "Motif",
    clientResetRequestRequestedAt: "Demande le",
    clientResetDecisionNote: "Note admin client (optionnel)",
    clientApproveRequest: "Approuver client",
    clientRejectRequest: "Refuser client",
  },
  en: {
    title: "Admin platform",
    subtitle: "App visitors, login risk and agent management",
    
    logout: "Log out",
    loading: "Loading admin platform...",
    notAdmin: "Admin access only.",
    refresh: "Refresh",
    periodDays: "Period (days)",
    failedThreshold: "Failed login threshold",
    visitorsCard: "Unique visitors",
    successLoginsCard: "Successful logins",
    riskyClientsCard: "Risk clients",
    activeAgentsCard: "Active agents",
    visitorsHint: "Estimated from client login activity",
    riskyTitle: "Clients with repeated failed logins",
    riskyEmpty: "No client above threshold.",
    colEmail: "Client email",
    colClientId: "Client ID",
    colFailedAttempts: "Failed attempts",
    colLastFailure: "Last failure",
    createAgentTitle: "Create agent account",
    fullName: "Full name",
    email: "Email",
    agency: "Agency",
    role: "Role",
    username: "Username (optional)",
    password: "Password (optional)",
    roleAgent: "Agent",
    roleAdmin: "Admin",
    createAgent: "Create agent",
    creating: "Creating...",
    generatedPasswordLabel: "Password to share",
    agentsTitle: "BH agents",
    resetPassword: "Reset password",
    resetting: "Resetting...",
    noAgents: "No agent found.",
    createdAt: "Created",
    lastLogin: "Last login",
    unknownDate: "-",
    resetRequestsTitle: "Agent password reset requests",
    resetRequestsEmpty: "No pending request.",
    resetRequestsRefresh: "Refresh requests",
    resetRequestIdentifier: "Submitted identifier",
    resetRequestReason: "Reason",
    resetRequestRequestedAt: "Requested at",
    resetDecisionNote: "Admin note (optional)",
    approveRequest: "Approve",
    rejectRequest: "Reject",
    deciding: "Processing...",
    clientResetRequestsTitle: "Client password reset requests",
    clientResetRequestsEmpty: "No pending client request.",
    clientResetRequestsRefresh: "Refresh client requests",
    clientResetRequestIdentifier: "Submitted email",
    clientResetRequestReason: "Reason",
    clientResetRequestRequestedAt: "Requested at",
    clientResetDecisionNote: "Client admin note (optional)",
    clientApproveRequest: "Approve client",
    clientRejectRequest: "Reject client",
  },
  ar: {
    title: "منصة الادارة",
    subtitle: "متابعة الزيارات ومخاطر تسجيل الدخول وادارة الوكلاء",
    
    logout: "Log out",
    loading: "Loading admin platform...",
    notAdmin: "Admin access only.",
    refresh: "Refresh",
    periodDays: "Period (days)",
    failedThreshold: "Failed login threshold",
    visitorsCard: "Unique visitors",
    successLoginsCard: "Successful logins",
    riskyClientsCard: "Risk clients",
    activeAgentsCard: "Active agents",
    visitorsHint: "Estimated from client login activity",
    riskyTitle: "Clients with repeated failed logins",
    riskyEmpty: "No client above threshold.",
    colEmail: "Client email",
    colClientId: "Client ID",
    colFailedAttempts: "Failed attempts",
    colLastFailure: "Last failure",
    createAgentTitle: "Create agent account",
    fullName: "Full name",
    email: "Email",
    agency: "Agency",
    role: "Role",
    username: "Username (optional)",
    password: "Password (optional)",
    roleAgent: "Agent",
    roleAdmin: "Admin",
    createAgent: "Create agent",
    creating: "Creating...",
    generatedPasswordLabel: "Password to share",
    agentsTitle: "BH agents",
    resetPassword: "Reset password",
    resetting: "Resetting...",
    noAgents: "No agent found.",
    createdAt: "Created",
    lastLogin: "Last login",
    unknownDate: "-",
    resetRequestsTitle: "Agent password reset requests",
    resetRequestsEmpty: "No pending request.",
    resetRequestsRefresh: "Refresh requests",
    resetRequestIdentifier: "Submitted identifier",
    resetRequestReason: "Reason",
    resetRequestRequestedAt: "Requested at",
    resetDecisionNote: "Admin note (optional)",
    approveRequest: "Approve",
    rejectRequest: "Reject",
    deciding: "Processing...",
    clientResetRequestsTitle: "Client password reset requests",
    clientResetRequestsEmpty: "No pending client request.",
    clientResetRequestsRefresh: "Refresh client requests",
    clientResetRequestIdentifier: "Submitted email",
    clientResetRequestReason: "Reason",
    clientResetRequestRequestedAt: "Requested at",
    clientResetDecisionNote: "Client admin note (optional)",
    clientApproveRequest: "Approve client",
    clientRejectRequest: "Reject client",
  },
};

const getLangKey = (language) => {
  if (language === "ar") return "ar";
  if (language === "en") return "en";
  return "fr";
};

const languageOptions = [
  {
    code: "fr",
    label: "FR",
    flag: flagFr,
    flagAlt: "France flag",
    aria: "Switch to French",
  },
  {
    code: "en",
    label: "EN",
    flag: flagEn,
    flagAlt: "United Kingdom flag",
    aria: "Switch to English",
  },
  {
    code: "ar",
    label: "AR",
    flag: flagAr,
    flagAlt: "Tunisia flag",
    aria: "Switch to Arabic",
  },
];

const formatDateTime = (value, fallback = "-") => {
  if (!value) return fallback;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return fallback;
  return date.toLocaleString();
};

export function AdminPlatformPage() {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { language, setLanguage, isRTL } = useLanguage();

  const ui = copyByLanguage[getLangKey(language)] || copyByLanguage.fr;

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [agentProfile, setAgentProfile] = useState(null);

  const [overview, setOverview] = useState(null);
  const [agents, setAgents] = useState([]);
  const [days, setDays] = useState(30);
  const [failedThreshold, setFailedThreshold] = useState(3);

  const [creating, setCreating] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [createdPassword, setCreatedPassword] = useState("");
  const [resetRequests, setResetRequests] = useState([]);
  const [resetRequestsLoading, setResetRequestsLoading] = useState(false);
  const [resetRequestsFeedback, setResetRequestsFeedback] = useState("");
  const [decisionNotes, setDecisionNotes] = useState({});
  const [decidingRequestId, setDecidingRequestId] = useState("");
  const [clientResetRequests, setClientResetRequests] = useState([]);
  const [clientResetRequestsLoading, setClientResetRequestsLoading] = useState(false);
  const [clientResetRequestsFeedback, setClientResetRequestsFeedback] = useState("");
  const [clientDecisionNotes, setClientDecisionNotes] = useState({});
  const [decidingClientRequestId, setDecidingClientRequestId] = useState("");

  const [form, setForm] = useState({
    agent_id: "",
    full_name: "",
    email: "",
    agence: "",
    role: "agent",
    password: "",
  });

  const isDark = theme === "dark";
  const isAdmin = useMemo(
    () => String(agentProfile?.role || "").toLowerCase() === "admin",
    [agentProfile?.role],
  );

  const cardClass = isDark
    ? "rounded-2xl border border-white/10 bg-[#14233b] p-4"
    : "rounded-2xl border border-[#d8e3f3] bg-white p-4";
  const smallCardClass = isDark
    ? "rounded-xl border border-white/10 bg-[#0f1d33] p-3"
    : "rounded-xl border border-[#dce6f5] bg-[#f7fbff] p-3";

  const handleUnauthorized = () => {
    clearAgentAuthSession();
    navigate("/agent/login", { replace: true });
  };

  const loadData = async ({ silent = false } = {}) => {
    try {
      if (!silent) {
        setLoading(true);
      } else {
        setRefreshing(true);
      }
      setErrorMessage("");

      const profile = await getAgentMe();
      setAgentProfile(profile || null);

      if (String(profile?.role || "").toLowerCase() !== "admin") {
        setOverview(null);
        setAgents([]);
        setResetRequests([]);
        setClientResetRequests([]);
        setErrorMessage(ui.notAdmin);
        return;
      }

      const [overviewPayload, agentsPayload, resetRequestsPayload, clientResetRequestsPayload] = await Promise.all([
        getAdminPlatformOverview(days, failedThreshold),
        listAdminAgents(),
        listAdminAgentPasswordResetRequests("pending", 100),
        listAdminClientPasswordResetRequests("pending", 100),
      ]);

      setOverview(overviewPayload || null);
      setAgents(Array.isArray(agentsPayload?.agents) ? agentsPayload.agents : []);
      setResetRequests(Array.isArray(resetRequestsPayload?.requests) ? resetRequestsPayload.requests : []);
      setClientResetRequests(Array.isArray(clientResetRequestsPayload?.requests) ? clientResetRequestsPayload.requests : []);
      setDecisionNotes({});
      setClientDecisionNotes({});
    } catch (error) {
      if (error?.status === 401 || error?.status === 403) {
        handleUnauthorized();
        return;
      }
      setErrorMessage(error?.message || "Admin load failed.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (!getAgentAuthToken()) {
      navigate("/agent/login", { replace: true });
      return;
    }

    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate]);

  const handleRefresh = async () => {
    await loadData({ silent: true });
  };

  const handleRefreshResetRequests = async () => {
    try {
      setResetRequestsLoading(true);
      setResetRequestsFeedback("");
      const payload = await listAdminAgentPasswordResetRequests("pending", 100);
      setResetRequests(Array.isArray(payload?.requests) ? payload.requests : []);
    } catch (error) {
      if (error?.status === 401 || error?.status === 403) {
        handleUnauthorized();
        return;
      }
      setResetRequestsFeedback(error?.message || "Unable to load reset requests.");
    } finally {
      setResetRequestsLoading(false);
    }
  };

  const handleRefreshClientResetRequests = async () => {
    try {
      setClientResetRequestsLoading(true);
      setClientResetRequestsFeedback("");
      const payload = await listAdminClientPasswordResetRequests("pending", 100);
      setClientResetRequests(Array.isArray(payload?.requests) ? payload.requests : []);
    } catch (error) {
      if (error?.status === 401 || error?.status === 403) {
        handleUnauthorized();
        return;
      }
      setClientResetRequestsFeedback(error?.message || "Unable to load client reset requests.");
    } finally {
      setClientResetRequestsLoading(false);
    }
  };

  const handleCreateAgent = async (event) => {
    event.preventDefault();
    if (creating) return;

    try {
      setCreating(true);
      setFeedback("");
      setCreatedPassword("");

      const payload = {
        agent_id: form.agent_id.trim() || undefined,
        full_name: form.full_name.trim(),
        email: form.email.trim().toLowerCase(),
        agence: form.agence.trim(),
        role: form.role,
        password: form.password || undefined,
      };

      const result = await createAdminAgent(payload);
      setFeedback(result?.message || "Agent created.");
      setCreatedPassword(result?.temporary_password || "");

      setForm((prev) => ({
        ...prev,
        agent_id: "",
        full_name: "",
        email: "",
        password: "",
      }));

      const agentsPayload = await listAdminAgents();
      setAgents(Array.isArray(agentsPayload?.agents) ? agentsPayload.agents : []);
    } catch (error) {
      if (error?.status === 401 || error?.status === 403) {
        handleUnauthorized();
        return;
      }
      setFeedback(error?.message || "Unable to create agent.");
    } finally {
      setCreating(false);
    }
  };

  const handleResetRequestDecision = async (requestId, decision) => {
    if (!requestId || decidingRequestId) return;

    try {
      setDecidingRequestId(String(requestId));
      setResetRequestsFeedback("");

      const note = String(decisionNotes[requestId] || "").trim();
      const result = await decideAdminAgentPasswordResetRequest(requestId, {
        decision,
        note: note || undefined,
      });

      setResetRequestsFeedback(result?.message || "Decision recorded.");
      setResetRequests((prev) => prev.filter((item) => item?.id !== requestId));
      setDecisionNotes((prev) => {
        const next = { ...prev };
        delete next[requestId];
        return next;
      });
    } catch (error) {
      if (error?.status === 401 || error?.status === 403) {
        handleUnauthorized();
        return;
      }
      setResetRequestsFeedback(error?.message || "Unable to decide request.");
    } finally {
      setDecidingRequestId("");
    }
  };

  const handleClientResetRequestDecision = async (requestId, decision) => {
    if (!requestId || decidingClientRequestId) return;

    try {
      setDecidingClientRequestId(String(requestId));
      setClientResetRequestsFeedback("");

      const note = String(clientDecisionNotes[requestId] || "").trim();
      const result = await decideAdminClientPasswordResetRequest(requestId, {
        decision,
        note: note || undefined,
      });

      setClientResetRequestsFeedback(result?.message || "Decision recorded.");
      setClientResetRequests((prev) => prev.filter((item) => item?.id !== requestId));
      setClientDecisionNotes((prev) => {
        const next = { ...prev };
        delete next[requestId];
        return next;
      });
    } catch (error) {
      if (error?.status === 401 || error?.status === 403) {
        handleUnauthorized();
        return;
      }
      setClientResetRequestsFeedback(error?.message || "Unable to decide client request.");
    } finally {
      setDecidingClientRequestId("");
    }
  };

  const riskyClients = Array.isArray(overview?.clients_with_failed_logins)
    ? overview.clients_with_failed_logins
    : [];

  const totalVisitors = Number(overview?.visitors?.unique_clients || 0);
  const totalSuccessLogins = Number(overview?.visitors?.total_success_logins || 0);
  const activeAgents = Number(overview?.totals?.active_agents || 0);

  if (loading) {
    return (
      <div className={`min-h-screen ${isDark ? "bg-[#0f172a] text-white" : "bg-[#edf3fb] text-[#10203c]"}`}>
        <div className="mx-auto max-w-6xl px-6 py-10">{ui.loading}</div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen ${isDark ? "bg-[#0f172a] text-white" : "bg-[#edf3fb] text-[#10203c]"}`}
      dir={isRTL ? "rtl" : "ltr"}
    >
      <header className={`border-b ${isDark ? "border-white/10 bg-[#101b31]" : "border-[#d8e3f3] bg-white"}`}>
        <div className="mx-auto grid w-full max-w-6xl grid-cols-[1fr_auto_1fr] items-center gap-3 px-6 py-4">
          <div className={`${isRTL ? "text-right" : "text-left"}`}>
            <p className="text-sm font-bold">{ui.title}</p>
            <p className={`text-xs ${isDark ? "text-white/70" : "text-[#5e7393]"}`}>{ui.subtitle}</p>
          </div>

          <div className="flex justify-center">
            <img src={logoExpanded} alt="BH Bank" className="h-10 w-auto sm:h-11" />
          </div>

          <div className={`flex items-center justify-end gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
            {languageOptions.map((item) => {
              const isActive = language === item.code;
              return (
                <button
                  key={item.code}
                  type="button"
                  onClick={() => setLanguage(item.code)}
                  className={`inline-flex h-9 w-9 items-center justify-center rounded-xl text-[11px] font-semibold transition ${
                    isActive
                      ? isDark
                        ? "bg-[#1f4b8f] text-white"
                        : "bg-[#0A2240] text-white"
                      : isDark
                        ? "text-white/85 hover:bg-white/10"
                        : "text-[#3d5174] hover:bg-[#e7eef9]"
                  }`}
                  aria-pressed={isActive}
                  aria-label={item.aria}
                >
                  <img src={item.flag} alt={item.flagAlt} className="h-4 w-4 rounded-full object-cover" />
                </button>
              );
            })}

            <button
              type="button"
              onClick={handleUnauthorized}
              className="inline-flex items-center gap-2 rounded-xl border border-rose-300 bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-700 hover:bg-rose-100"
            >
              <LogOut size={16} />
              {ui.logout}
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-6 px-6 py-6">
        {errorMessage && (
          <section className={isDark ? "rounded-2xl border border-rose-300/40 bg-rose-500/10 p-4 text-rose-100" : "rounded-2xl border border-rose-300 bg-rose-50 p-4 text-rose-700"}>
            {errorMessage}
          </section>
        )}

        {!isAdmin ? null : (
          <>
            <section className={cardClass}>
              <div className="grid gap-3 lg:grid-cols-[1fr_1fr_1fr_auto]">
                <label className="text-sm font-semibold">
                  <span>{ui.periodDays}</span>
                  <input
                    type="number"
                    min={1}
                    max={365}
                    value={days}
                    onChange={(event) => setDays(Number(event.target.value || 30))}
                    className={
                      isDark
                        ? "mt-1 w-full rounded-xl border border-white/15 bg-[#0d192c] px-3 py-2 text-sm text-white"
                        : "mt-1 w-full rounded-xl border border-[#ccdaee] bg-white px-3 py-2 text-sm text-[#10203c]"
                    }
                  />
                </label>

                <label className="text-sm font-semibold">
                  <span>{ui.failedThreshold}</span>
                  <input
                    type="number"
                    min={3}
                    max={20}
                    value={failedThreshold}
                    onChange={(event) => setFailedThreshold(Number(event.target.value || 3))}
                    className={
                      isDark
                        ? "mt-1 w-full rounded-xl border border-white/15 bg-[#0d192c] px-3 py-2 text-sm text-white"
                        : "mt-1 w-full rounded-xl border border-[#ccdaee] bg-white px-3 py-2 text-sm text-[#10203c]"
                    }
                  />
                </label>

                <div className={smallCardClass}>
                  <p className={`text-xs ${isDark ? "text-white/65" : "text-[#5e7393]"}`}>{ui.visitorsHint}</p>
                  <p className="mt-2 text-xs font-semibold">{overview?.generated_at ? formatDateTime(overview.generated_at, ui.unknownDate) : ui.unknownDate}</p>
                </div>

                <button
                  type="button"
                  onClick={handleRefresh}
                  disabled={refreshing}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0A2240] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#123662] disabled:opacity-60"
                >
                  <RefreshCcw size={15} className={refreshing ? "animate-spin" : ""} />
                  {ui.refresh}
                </button>
              </div>
            </section>

            <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <article className={smallCardClass}>
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold uppercase tracking-wide">{ui.visitorsCard}</p>
                  <Users size={16} />
                </div>
                <p className="mt-2 text-2xl font-extrabold">{totalVisitors.toLocaleString()}</p>
              </article>

              <article className={smallCardClass}>
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold uppercase tracking-wide">{ui.successLoginsCard}</p>
                  <Activity size={16} />
                </div>
                <p className="mt-2 text-2xl font-extrabold">{totalSuccessLogins.toLocaleString()}</p>
              </article>

              <article className={smallCardClass}>
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold uppercase tracking-wide">{ui.riskyClientsCard}</p>
                  <AlertTriangle size={16} />
                </div>
                <p className="mt-2 text-2xl font-extrabold">{riskyClients.length.toLocaleString()}</p>
              </article>

              <article className={smallCardClass}>
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold uppercase tracking-wide">{ui.activeAgentsCard}</p>
                  <ShieldUser size={16} />
                </div>
                <p className="mt-2 text-2xl font-extrabold">{activeAgents.toLocaleString()}</p>
              </article>
            </section>

            <section className={cardClass}>
              <h2 className="text-lg font-bold">{ui.riskyTitle}</h2>
              <div className="mt-4 overflow-x-auto">
                {riskyClients.length === 0 ? (
                  <p className={`text-sm ${isDark ? "text-white/70" : "text-[#5e7393]"}`}>{ui.riskyEmpty}</p>
                ) : (
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className={isDark ? "text-white/75" : "text-[#4f6688]"}>
                        <th className="px-2 py-2 text-left">{ui.colEmail}</th>
                        <th className="px-2 py-2 text-left">{ui.colClientId}</th>
                        <th className="px-2 py-2 text-left">{ui.colFailedAttempts}</th>
                        <th className="px-2 py-2 text-left">{ui.colLastFailure}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {riskyClients.map((row) => (
                        <tr key={`${row.email}-${row.last_failed_at || ""}`} className={isDark ? "border-t border-white/10" : "border-t border-[#e0e9f6]"}>
                          <td className="px-2 py-2 font-medium">{row.email || "-"}</td>
                          <td className="px-2 py-2">{row.client_id || "-"}</td>
                          <td className="px-2 py-2">{Number(row.failed_attempts || 0).toLocaleString()}</td>
                          <td className="px-2 py-2">{formatDateTime(row.last_failed_at, ui.unknownDate)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </section>

            <section className={cardClass}>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-lg font-bold">{ui.resetRequestsTitle}</h2>
                <button
                  type="button"
                  onClick={handleRefreshResetRequests}
                  disabled={resetRequestsLoading}
                  className={
                    isDark
                      ? "inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-3 py-2 text-xs font-semibold text-white hover:bg-white/10 disabled:opacity-60"
                      : "inline-flex items-center gap-2 rounded-xl border border-[#cddcf0] bg-[#f4f8ff] px-3 py-2 text-xs font-semibold text-[#20406c] hover:bg-[#eaf2ff] disabled:opacity-60"
                  }
                >
                  <RefreshCcw size={14} className={resetRequestsLoading ? "animate-spin" : ""} />
                  {ui.resetRequestsRefresh}
                </button>
              </div>

              {resetRequestsFeedback && (
                <p
                  className={`mt-3 rounded-xl border px-3 py-2 text-sm ${
                    isDark
                      ? "border-cyan-300/30 bg-cyan-500/10 text-cyan-100"
                      : "border-cyan-200 bg-cyan-50 text-cyan-900"
                  }`}
                >
                  {resetRequestsFeedback}
                </p>
              )}

              <div className="mt-4 space-y-3">
                {resetRequests.length === 0 ? (
                  <p className={`text-sm ${isDark ? "text-white/70" : "text-[#5e7393]"}`}>{ui.resetRequestsEmpty}</p>
                ) : (
                  resetRequests.map((item) => {
                    const requestId = item?.id;
                    const requestBusy = String(requestId) === decidingRequestId;

                    return (
                      <div key={String(requestId)} className={smallCardClass}>
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div>
                            <p className="font-semibold">{item?.agent_full_name || item?.agent_id || "-"}</p>
                            <p className={`text-xs ${isDark ? "text-white/65" : "text-[#5e7393]"}`}>
                              {item?.agent_email || "-"} | {item?.agent_agence || "-"}
                            </p>
                            <p className={`mt-1 text-xs ${isDark ? "text-white/65" : "text-[#5e7393]"}`}>
                              {ui.resetRequestIdentifier}: {item?.requested_identifier || "-"}
                            </p>
                            <p className={`text-xs ${isDark ? "text-white/65" : "text-[#5e7393]"}`}>
                              {ui.resetRequestRequestedAt}: {formatDateTime(item?.requested_at, ui.unknownDate)}
                            </p>
                            <p className={`mt-1 text-xs ${isDark ? "text-white/65" : "text-[#5e7393]"}`}>
                              {ui.resetRequestReason}: {item?.request_reason || "-"}
                            </p>
                          </div>
                        </div>

                        <label className="mt-3 block text-xs font-semibold">
                          <span>{ui.resetDecisionNote}</span>
                          <textarea
                            rows={2}
                            value={decisionNotes[requestId] || ""}
                            onChange={(event) =>
                              setDecisionNotes((prev) => ({
                                ...prev,
                                [requestId]: event.target.value,
                              }))
                            }
                            className={
                              isDark
                                ? "mt-1 w-full rounded-xl border border-white/15 bg-[#0d192c] px-3 py-2 text-xs text-white"
                                : "mt-1 w-full rounded-xl border border-[#ccdaee] bg-white px-3 py-2 text-xs text-[#10203c]"
                            }
                          />
                        </label>

                        <div className="mt-3 flex flex-wrap items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleResetRequestDecision(requestId, "approve")}
                            disabled={Boolean(decidingRequestId)}
                            className="inline-flex items-center gap-2 rounded-xl border border-emerald-300 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-800 hover:bg-emerald-100 disabled:opacity-60"
                          >
                            <CheckCircle2 size={14} />
                            {requestBusy ? ui.deciding : ui.approveRequest}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleResetRequestDecision(requestId, "reject")}
                            disabled={Boolean(decidingRequestId)}
                            className="inline-flex items-center gap-2 rounded-xl border border-rose-300 bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-800 hover:bg-rose-100 disabled:opacity-60"
                          >
                            <XCircle size={14} />
                            {requestBusy ? ui.deciding : ui.rejectRequest}
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </section>

            <section className={cardClass}>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-lg font-bold">{ui.clientResetRequestsTitle}</h2>
                <button
                  type="button"
                  onClick={handleRefreshClientResetRequests}
                  disabled={clientResetRequestsLoading}
                  className={
                    isDark
                      ? "inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-3 py-2 text-xs font-semibold text-white hover:bg-white/10 disabled:opacity-60"
                      : "inline-flex items-center gap-2 rounded-xl border border-[#cddcf0] bg-[#f4f8ff] px-3 py-2 text-xs font-semibold text-[#20406c] hover:bg-[#eaf2ff] disabled:opacity-60"
                  }
                >
                  <RefreshCcw size={14} className={clientResetRequestsLoading ? "animate-spin" : ""} />
                  {ui.clientResetRequestsRefresh}
                </button>
              </div>

              {clientResetRequestsFeedback && (
                <p
                  className={`mt-3 rounded-xl border px-3 py-2 text-sm ${
                    isDark
                      ? "border-cyan-300/30 bg-cyan-500/10 text-cyan-100"
                      : "border-cyan-200 bg-cyan-50 text-cyan-900"
                  }`}
                >
                  {clientResetRequestsFeedback}
                </p>
              )}

              <div className="mt-4 space-y-3">
                {clientResetRequests.length === 0 ? (
                  <p className={`text-sm ${isDark ? "text-white/70" : "text-[#5e7393]"}`}>{ui.clientResetRequestsEmpty}</p>
                ) : (
                  clientResetRequests.map((item) => {
                    const requestId = item?.id;
                    const requestBusy = String(requestId) === decidingClientRequestId;

                    return (
                      <div key={String(requestId)} className={smallCardClass}>
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div>
                            <p className="font-semibold">{item?.client_name || item?.client_id || "-"}</p>
                            <p className={`text-xs ${isDark ? "text-white/65" : "text-[#5e7393]"}`}>
                              {item?.client_email || "-"} | {item?.client_id || "-"}
                            </p>
                            <p className={`mt-1 text-xs ${isDark ? "text-white/65" : "text-[#5e7393]"}`}>
                              {ui.clientResetRequestIdentifier}: {item?.requested_identifier || "-"}
                            </p>
                            <p className={`text-xs ${isDark ? "text-white/65" : "text-[#5e7393]"}`}>
                              {ui.clientResetRequestRequestedAt}: {formatDateTime(item?.requested_at, ui.unknownDate)}
                            </p>
                            <p className={`mt-1 text-xs ${isDark ? "text-white/65" : "text-[#5e7393]"}`}>
                              {ui.clientResetRequestReason}: {item?.request_reason || "-"}
                            </p>
                          </div>
                        </div>

                        <label className="mt-3 block text-xs font-semibold">
                          <span>{ui.clientResetDecisionNote}</span>
                          <textarea
                            rows={2}
                            value={clientDecisionNotes[requestId] || ""}
                            onChange={(event) =>
                              setClientDecisionNotes((prev) => ({
                                ...prev,
                                [requestId]: event.target.value,
                              }))
                            }
                            className={
                              isDark
                                ? "mt-1 w-full rounded-xl border border-white/15 bg-[#0d192c] px-3 py-2 text-xs text-white"
                                : "mt-1 w-full rounded-xl border border-[#ccdaee] bg-white px-3 py-2 text-xs text-[#10203c]"
                            }
                          />
                        </label>

                        <div className="mt-3 flex flex-wrap items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleClientResetRequestDecision(requestId, "approve")}
                            disabled={Boolean(decidingClientRequestId)}
                            className="inline-flex items-center gap-2 rounded-xl border border-emerald-300 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-800 hover:bg-emerald-100 disabled:opacity-60"
                          >
                            <CheckCircle2 size={14} />
                            {requestBusy ? ui.deciding : ui.clientApproveRequest}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleClientResetRequestDecision(requestId, "reject")}
                            disabled={Boolean(decidingClientRequestId)}
                            className="inline-flex items-center gap-2 rounded-xl border border-rose-300 bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-800 hover:bg-rose-100 disabled:opacity-60"
                          >
                            <XCircle size={14} />
                            {requestBusy ? ui.deciding : ui.clientRejectRequest}
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </section>

            <section className="grid gap-6 xl:grid-cols-[1.1fr_1fr]">
              <article className={cardClass}>
                <h2 className="text-lg font-bold">{ui.createAgentTitle}</h2>
                <form className="mt-4 grid gap-3" onSubmit={handleCreateAgent}>
                  <input
                    value={form.full_name}
                    onChange={(event) => setForm((prev) => ({ ...prev, full_name: event.target.value }))}
                    placeholder={ui.fullName}
                    className={
                      isDark
                        ? "rounded-xl border border-white/15 bg-[#0d192c] px-3 py-2.5 text-sm text-white"
                        : "rounded-xl border border-[#ccdaee] bg-white px-3 py-2.5 text-sm"
                    }
                    required
                  />
                  <input
                    type="email"
                    value={form.email}
                    onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
                    placeholder={ui.email}
                    className={
                      isDark
                        ? "rounded-xl border border-white/15 bg-[#0d192c] px-3 py-2.5 text-sm text-white"
                        : "rounded-xl border border-[#ccdaee] bg-white px-3 py-2.5 text-sm"
                    }
                    required
                  />
                  <input
                    value={form.agence}
                    onChange={(event) => setForm((prev) => ({ ...prev, agence: event.target.value }))}
                    placeholder={ui.agency}
                    className={
                      isDark
                        ? "rounded-xl border border-white/15 bg-[#0d192c] px-3 py-2.5 text-sm text-white"
                        : "rounded-xl border border-[#ccdaee] bg-white px-3 py-2.5 text-sm"
                    }
                  />
                  <div className="grid gap-3 sm:grid-cols-2">
                    <input
                      value={form.agent_id}
                      onChange={(event) => setForm((prev) => ({ ...prev, agent_id: event.target.value }))}
                      placeholder={ui.username}
                      className={
                        isDark
                          ? "rounded-xl border border-white/15 bg-[#0d192c] px-3 py-2.5 text-sm text-white"
                          : "rounded-xl border border-[#ccdaee] bg-white px-3 py-2.5 text-sm"
                      }
                    />
                    <input
                      value={form.password}
                      onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
                      placeholder={ui.password}
                      className={
                        isDark
                          ? "rounded-xl border border-white/15 bg-[#0d192c] px-3 py-2.5 text-sm text-white"
                          : "rounded-xl border border-[#ccdaee] bg-white px-3 py-2.5 text-sm"
                      }
                    />
                  </div>
                  <select
                    value={form.role}
                    onChange={(event) => setForm((prev) => ({ ...prev, role: event.target.value }))}
                    className={
                      isDark
                        ? "rounded-xl border border-white/15 bg-[#0d192c] px-3 py-2.5 text-sm text-white"
                        : "rounded-xl border border-[#ccdaee] bg-white px-3 py-2.5 text-sm"
                    }
                  >
                    <option value="agent">{ui.roleAgent}</option>
                    <option value="admin">{ui.roleAdmin}</option>
                  </select>

                  <button
                    type="submit"
                    disabled={creating}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0A2240] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#123662] disabled:opacity-60"
                  >
                    <UserCog size={16} />
                    {creating ? ui.creating : ui.createAgent}
                  </button>
                </form>

                {(feedback || createdPassword) && (
                  <div className={isDark ? "mt-4 rounded-xl border border-cyan-300/30 bg-cyan-500/10 p-3 text-sm" : "mt-4 rounded-xl border border-cyan-200 bg-cyan-50 p-3 text-sm text-cyan-900"}>
                    {feedback && <p className="font-semibold">{feedback}</p>}
                    {createdPassword && (
                      <p className="mt-2">
                        <span className="font-semibold">{ui.generatedPasswordLabel}: </span>
                        <span className="font-mono">{createdPassword}</span>
                      </p>
                    )}
                  </div>
                )}
              </article>

              <article className={cardClass}>
                <h2 className="text-lg font-bold">{ui.agentsTitle}</h2>
                <div className="mt-4 max-h-112 overflow-auto pr-1">
                  {agents.length === 0 ? (
                    <p className={`text-sm ${isDark ? "text-white/70" : "text-[#5e7393]"}`}>{ui.noAgents}</p>
                  ) : (
                    <div className="space-y-2">
                      {agents.map((agent) => {
                        const agentId = String(agent?.agent_id || "");

                        return (
                          <div key={agentId} className={smallCardClass}>
                            <div>
                              <div>
                                <p className="font-semibold">{agent?.full_name || agentId}</p>
                                <p className={`text-xs ${isDark ? "text-white/65" : "text-[#5e7393]"}`}>{agent?.email || "-"}</p>
                                <p className={`text-xs ${isDark ? "text-white/65" : "text-[#5e7393]"}`}>{agent?.agence || "-"}</p>
                                <p className={`text-[11px] ${isDark ? "text-white/55" : "text-[#6f83a4]"}`}>
                                  {ui.createdAt}: {formatDateTime(agent?.created_at, ui.unknownDate)} | {ui.lastLogin}: {formatDateTime(agent?.last_login, ui.unknownDate)}
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </article>
            </section>
          </>
        )}
      </main>
    </div>
  );
}
