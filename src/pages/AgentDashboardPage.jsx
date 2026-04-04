import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import {
  AlertCircle,
  CheckCircle2,
  LogOut,
  Search,
  ShieldUser,
  UserRound,
  XCircle,
} from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";
import { useLanguage } from "../contexts/LanguageContext";
import {
  clearAgentAuthSession,
  getAgentAuthToken,
  getAgentCreditAnalysis,
  getAgentDashboard,
  searchAgentClient,
} from "../api";

const copyByLanguage = {
  en: {
    title: "Agent Dashboard",
    subtitle: "Internal BH Bank analysis panel",
    totalClients: "Total clients",
    eligible: "Eligible",
    partial: "Partially eligible",
    notEligible: "Not eligible",
    formsCompleted: "Forms completed",
    searchTitle: "Client credit lookup",
    searchHint: "Search by CIN",
    searchPlaceholder: "Enter CIN (numbers only)",
    runSearch: "Analyze",
    searching: "Analyzing...",
    noResult: "No analysis loaded yet.",
    summaryTitle: "Client summary",
    decisionTitle: "Credit decision",
    indicatorsTitle: "Financial indicators",
    reasonsTitle: "Decision reasons",
    capacityTitle: "Borrowing capacity",
    logout: "Log out",
    loginExpired: "Session expired. Please sign in again.",
    invalidCin: "CIN must contain numbers only.",
  },
  fr: {
    title: "Tableau Agent",
    subtitle: "Panel interne d'analyse BH Bank",
    totalClients: "Clients totaux",
    eligible: "Eligible",
    partial: "Partiellement eligible",
    notEligible: "Non eligible",
    formsCompleted: "Formulaires completes",
    searchTitle: "Recherche credit client",
    searchHint: "Recherche par CIN",
    searchPlaceholder: "Entrez le CIN (chiffres uniquement)",
    runSearch: "Analyser",
    searching: "Analyse en cours...",
    noResult: "Aucune analyse chargee.",
    summaryTitle: "Resume client",
    decisionTitle: "Decision credit",
    indicatorsTitle: "Indicateurs financiers",
    reasonsTitle: "Raisons de decision",
    capacityTitle: "Capacite d'emprunt",
    logout: "Deconnexion",
    loginExpired: "Session expiree. Reconnectez-vous.",
    invalidCin: "Le CIN doit contenir uniquement des chiffres.",
  },
  ar: {
    title: "Agent Dashboard",
    subtitle: "BH Bank internal analysis panel",
    totalClients: "Total clients",
    eligible: "Eligible",
    partial: "Partially eligible",
    notEligible: "Not eligible",
    formsCompleted: "Forms completed",
    searchTitle: "Client credit lookup",
    searchHint: "Search by CIN",
    searchPlaceholder: "Enter CIN (numbers only)",
    runSearch: "Analyze",
    searching: "Analyzing...",
    noResult: "No analysis loaded yet.",
    summaryTitle: "Client summary",
    decisionTitle: "Credit decision",
    indicatorsTitle: "Financial indicators",
    reasonsTitle: "Decision reasons",
    capacityTitle: "Borrowing capacity",
    logout: "Log out",
    loginExpired: "Session expired. Please sign in again.",
    invalidCin: "CIN must contain numbers only.",
  },
};

const getLangKey = (language) => {
  if (language === "ar") return "ar";
  if (language === "en") return "en";
  return "fr";
};

const formatMoney = (value) => {
  const number = Number(value || 0);
  return `${number.toLocaleString(undefined, { maximumFractionDigits: 0 })} TND`;
};

const badgeByEligibility = {
  Eligible: "bg-emerald-100 text-emerald-800 border-emerald-200",
  "Partially Eligible": "bg-amber-100 text-amber-800 border-amber-200",
  "Not Eligible": "bg-rose-100 text-rose-800 border-rose-200",
};

export function AgentDashboardPage() {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { language, isRTL } = useLanguage();

  const ui = copyByLanguage[getLangKey(language)] || copyByLanguage.fr;

  const [loadingOverview, setLoadingOverview] = useState(true);
  const [overviewError, setOverviewError] = useState("");
  const [dashboard, setDashboard] = useState(null);

  const [cin, setCin] = useState("");
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState("");
  const [clientSummary, setClientSummary] = useState(null);
  const [creditAnalysis, setCreditAnalysis] = useState(null);

  const handleLogout = () => {
    clearAgentAuthSession();
    navigate("/agent/login", { replace: true });
  };

  useEffect(() => {
    if (!getAgentAuthToken()) {
      navigate("/agent/login", { replace: true });
      return;
    }

    const loadDashboard = async () => {
      try {
        setLoadingOverview(true);
        setOverviewError("");
        const data = await getAgentDashboard();
        setDashboard(data || null);
      } catch (error) {
        if (error?.status === 401 || error?.status === 403) {
          clearAgentAuthSession();
          navigate("/agent/login", { replace: true });
          return;
        }
        setOverviewError(error.message || "Unable to load agent dashboard.");
      } finally {
        setLoadingOverview(false);
      }
    };

    loadDashboard();
  }, [navigate]);

  const statCards = useMemo(() => {
    const eligibility = dashboard?.loan_eligibility || {};
    return [
      { label: ui.totalClients, value: dashboard?.total_clients || 0 },
      { label: ui.eligible, value: eligibility.Eligible || 0 },
      { label: ui.partial, value: eligibility["Partially Eligible"] || 0 },
      { label: ui.notEligible, value: eligibility["Not Eligible"] || 0 },
      { label: ui.formsCompleted, value: dashboard?.forms_completed || 0 },
    ];
  }, [dashboard, ui]);

  const handleSearch = async (event) => {
    event.preventDefault();
    if (searching) return;

    const normalizedCin = cin.trim();
    if (!/^\d+$/.test(normalizedCin)) {
      setSearchError(ui.invalidCin);
      return;
    }

    try {
      setSearching(true);
      setSearchError("");
      setClientSummary(null);
      setCreditAnalysis(null);

      const summary = await searchAgentClient(normalizedCin);
      setClientSummary(summary || null);

      const analysis = await getAgentCreditAnalysis(summary?.client_id || normalizedCin);
      setCreditAnalysis(analysis || null);
    } catch (error) {
      if (error?.status === 401 || error?.status === 403) {
        clearAgentAuthSession();
        navigate("/agent/login", { replace: true });
        return;
      }
      setSearchError(error.message || "Client search failed.");
    } finally {
      setSearching(false);
    }
  };

  const loanDecision = creditAnalysis?.credit_decision || null;
  const financialIndicators = creditAnalysis?.financial_indicators || null;
  const reasons = Array.isArray(loanDecision?.reasons) ? loanDecision.reasons : [];

  return (
    <div
      className={`min-h-screen ${theme === "dark" ? "bg-[#0f172a] text-white" : "bg-[#f4f7fc] text-[#172946]"}`}
      dir={isRTL ? "rtl" : "ltr"}
    >
      <header className={`border-b px-5 py-4 sm:px-8 ${theme === "dark" ? "border-white/10 bg-[#0f172a]" : "border-[#dbe4f2] bg-white"}`}>
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4">
          <div className={`flex items-center gap-3 ${isRTL ? "flex-row-reverse" : ""}`}>
            <span className={`inline-flex h-10 w-10 items-center justify-center rounded-xl ${theme === "dark" ? "bg-white/10" : "bg-[#e9eef8]"}`}>
              <ShieldUser size={19} />
            </span>
            <div className={isRTL ? "text-right" : "text-left"}>
              <h1 className="text-xl font-bold sm:text-2xl">{ui.title}</h1>
              <p className={`text-xs sm:text-sm ${theme === "dark" ? "text-white/65" : "text-[#607295]"}`}>{ui.subtitle}</p>
            </div>
          </div>

          <div className={`flex items-center gap-3 ${isRTL ? "flex-row-reverse" : ""}`}>
            <div className={`rounded-xl border px-3 py-2 text-xs sm:text-sm ${theme === "dark" ? "border-white/15 bg-white/5" : "border-[#d7e0ee] bg-[#f8fafe]"}`}>
              {dashboard?.agent?.full_name || dashboard?.agent?.agent_id || "Agent"}
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-2 rounded-xl border border-rose-300 bg-rose-50 px-3 py-2 text-sm font-medium text-rose-700 hover:bg-rose-100"
            >
              <LogOut size={16} />
              {ui.logout}
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl px-5 py-6 sm:px-8">
        {overviewError && (
          <div className={`mb-4 rounded-xl border px-4 py-3 text-sm ${theme === "dark" ? "border-red-900/60 bg-red-950/40 text-red-300" : "border-red-200 bg-red-50 text-red-700"}`}>
            {overviewError}
          </div>
        )}

        {loadingOverview ? (
          <div className={`rounded-2xl border px-4 py-5 text-sm ${theme === "dark" ? "border-white/10 bg-white/5" : "border-[#d7e0ee] bg-white"}`}>
            Loading dashboard...
          </div>
        ) : (
          <>
            <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
              {statCards.map((card) => (
                <article
                  key={card.label}
                  className={`rounded-2xl border p-4 ${theme === "dark" ? "border-white/10 bg-white/5" : "border-[#d8e1ef] bg-white"}`}
                >
                  <p className={`text-xs ${theme === "dark" ? "text-white/65" : "text-[#7184a7]"}`}>{card.label}</p>
                  <p className="mt-2 text-2xl font-extrabold">{Number(card.value || 0).toLocaleString()}</p>
                </article>
              ))}
            </section>

            <section className="mt-6 grid gap-6 lg:grid-cols-[1.15fr_1fr]">
              <div className={`rounded-2xl border p-5 ${theme === "dark" ? "border-white/10 bg-white/5" : "border-[#d8e1ef] bg-white"}`}>
                <h2 className="text-lg font-bold">{ui.searchTitle}</h2>
                <p className={`mt-1 text-sm ${theme === "dark" ? "text-white/65" : "text-[#6f82a3]"}`}>{ui.searchHint}</p>

                <form onSubmit={handleSearch} className="mt-4 flex flex-col gap-3 sm:flex-row">
                  <input
                    value={cin}
                    onChange={(event) => setCin(event.target.value)}
                    placeholder={ui.searchPlaceholder}
                    className={`w-full rounded-xl border px-3 py-2.5 text-sm ${
                      theme === "dark"
                        ? "border-white/15 bg-[#0b1628] text-white placeholder:text-white/35"
                        : "border-[#d2dced] bg-[#f9fbff] text-[#172946] placeholder:text-[#8ea0be]"
                    } ${isRTL ? "text-right" : "text-left"}`}
                  />
                  <button
                    type="submit"
                    disabled={searching}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0A2240] px-4 py-2.5 text-sm font-semibold text-white hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <Search size={16} />
                    {searching ? ui.searching : ui.runSearch}
                  </button>
                </form>

                {searchError && (
                  <p className={`mt-4 rounded-xl border px-3 py-2 text-sm ${theme === "dark" ? "border-red-900/60 bg-red-950/40 text-red-300" : "border-red-200 bg-red-50 text-red-700"}`}>
                    {searchError}
                  </p>
                )}

                {!clientSummary && !searchError && (
                  <p className={`mt-4 text-sm ${theme === "dark" ? "text-white/60" : "text-[#6f82a3]"}`}>{ui.noResult}</p>
                )}

                {clientSummary && (
                  <div className={`mt-5 rounded-2xl border p-4 ${theme === "dark" ? "border-white/15 bg-[#0b1628]" : "border-[#d7e0ee] bg-[#f8fbff]"}`}>
                    <h3 className="text-base font-semibold">{ui.summaryTitle}</h3>
                    <div className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
                      <p>
                        <span className={theme === "dark" ? "text-white/60" : "text-[#607295]"}>ID:</span> {clientSummary.client_id || "-"}
                      </p>
                      <p>
                        <span className={theme === "dark" ? "text-white/60" : "text-[#607295]"}>Name:</span> {clientSummary.client_name || "-"}
                      </p>
                      <p>
                        <span className={theme === "dark" ? "text-white/60" : "text-[#607295]"}>Segment:</span> {clientSummary.rfm_segment || "-"}
                      </p>
                      <p>
                        <span className={theme === "dark" ? "text-white/60" : "text-[#607295]"}>Score:</span> {Number(clientSummary.financial_score || 0).toFixed(0)}/100
                      </p>
                    </div>
                  </div>
                )}

                {!!dashboard?.rfm_segments && (
                  <div className="mt-5">
                    <h3 className="text-sm font-semibold">RFM distribution</h3>
                    <div className="mt-3 space-y-2">
                      {Object.entries(dashboard.rfm_segments).map(([segment, count]) => (
                        <div key={segment} className="grid grid-cols-[1fr_auto] items-center gap-3 text-sm">
                          <div className={`h-2.5 overflow-hidden rounded-full ${theme === "dark" ? "bg-white/10" : "bg-[#e8eef8]"}`}>
                            <div
                              className="h-full rounded-full bg-[#0A2240]"
                              style={{
                                width: `${Math.min(
                                  100,
                                  ((Number(count || 0) / Math.max(1, Number(dashboard.total_clients || 1))) * 100),
                                )}%`,
                              }}
                            />
                          </div>
                          <span className={theme === "dark" ? "text-white/70" : "text-[#607295]"}>
                            {segment}: {Number(count || 0).toLocaleString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className={`rounded-2xl border p-5 ${theme === "dark" ? "border-white/10 bg-white/5" : "border-[#d8e1ef] bg-white"}`}>
                <h2 className="text-lg font-bold">{ui.decisionTitle}</h2>

                {!loanDecision ? (
                  <p className={`mt-4 text-sm ${theme === "dark" ? "text-white/65" : "text-[#6f82a3]"}`}>{ui.noResult}</p>
                ) : (
                  <div className="mt-4 space-y-4">
                    <div
                      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm font-semibold ${
                        badgeByEligibility[loanDecision.eligibility] || "bg-slate-100 text-slate-700 border-slate-200"
                      }`}
                    >
                      {loanDecision.eligibility === "Eligible" ? <CheckCircle2 size={15} /> : <XCircle size={15} />}
                      {loanDecision.eligibility || "-"}
                    </div>

                    <div>
                      <h3 className="text-sm font-semibold">{ui.reasonsTitle}</h3>
                      <ul className="mt-2 space-y-2 text-sm">
                        {reasons.length > 0 ? (
                          reasons.map((reason, index) => (
                            <li key={`${reason}-${index}`} className={`rounded-lg border px-3 py-2 ${theme === "dark" ? "border-white/10 bg-[#0b1628]" : "border-[#dbe4f2] bg-[#f8fbff]"}`}>
                              {reason}
                            </li>
                          ))
                        ) : (
                          <li className={theme === "dark" ? "text-white/65" : "text-[#6f82a3]"}>No specific reason provided.</li>
                        )}
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-sm font-semibold">{ui.capacityTitle}</h3>
                      <div className="mt-2 grid gap-2 text-sm sm:grid-cols-2">
                        <p className={`rounded-lg border px-3 py-2 ${theme === "dark" ? "border-white/10 bg-[#0b1628]" : "border-[#dbe4f2] bg-[#f8fbff]"}`}>
                          36m: {formatMoney(loanDecision?.borrowing_capacity?.["36_months"])}
                        </p>
                        <p className={`rounded-lg border px-3 py-2 ${theme === "dark" ? "border-white/10 bg-[#0b1628]" : "border-[#dbe4f2] bg-[#f8fbff]"}`}>
                          60m: {formatMoney(loanDecision?.borrowing_capacity?.["60_months"])}
                        </p>
                        <p className={`rounded-lg border px-3 py-2 ${theme === "dark" ? "border-white/10 bg-[#0b1628]" : "border-[#dbe4f2] bg-[#f8fbff]"}`}>
                          84m: {formatMoney(loanDecision?.borrowing_capacity?.["84_months"])}
                        </p>
                        <p className={`rounded-lg border px-3 py-2 ${theme === "dark" ? "border-white/10 bg-[#0b1628]" : "border-[#dbe4f2] bg-[#f8fbff]"}`}>
                          Monthly: {formatMoney(loanDecision?.max_monthly_payment)}
                        </p>
                      </div>
                    </div>

                    {financialIndicators && (
                      <div>
                        <h3 className="text-sm font-semibold">{ui.indicatorsTitle}</h3>
                        <div className="mt-2 grid gap-2 text-sm sm:grid-cols-2">
                          <p className={`rounded-lg border px-3 py-2 ${theme === "dark" ? "border-white/10 bg-[#0b1628]" : "border-[#dbe4f2] bg-[#f8fbff]"}`}>
                            Salary: {formatMoney(financialIndicators.monthly_salary)}
                          </p>
                          <p className={`rounded-lg border px-3 py-2 ${theme === "dark" ? "border-white/10 bg-[#0b1628]" : "border-[#dbe4f2] bg-[#f8fbff]"}`}>
                            Expenses: {formatMoney(financialIndicators.avg_monthly_expenses)}
                          </p>
                          <p className={`rounded-lg border px-3 py-2 ${theme === "dark" ? "border-white/10 bg-[#0b1628]" : "border-[#dbe4f2] bg-[#f8fbff]"}`}>
                            Savings: {formatMoney(financialIndicators.net_monthly_savings)}
                          </p>
                          <p className={`rounded-lg border px-3 py-2 ${theme === "dark" ? "border-white/10 bg-[#0b1628]" : "border-[#dbe4f2] bg-[#f8fbff]"}`}>
                            Score: {Number(financialIndicators.financial_score || 0).toFixed(0)}/100
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </section>

            <p className={`mt-5 inline-flex items-center gap-2 text-xs ${theme === "dark" ? "text-white/55" : "text-[#7a8ba8]"}`}>
              <AlertCircle size={13} />
              {ui.loginExpired}
            </p>
          </>
        )}
      </main>
    </div>
  );
}
